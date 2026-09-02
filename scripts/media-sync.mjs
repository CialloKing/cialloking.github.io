#!/usr/bin/env node

import path from "node:path";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import {
  collectManagedFiles,
  isManagedMediaPath,
  mediaTypeFor,
} from "./lib/media-paths.mjs";

function parseArguments(argv)
{
  const positional = [];
  let lockPath = null;

  for (let index = 0; index < argv.length; index += 1)
  {
    if (argv[index] === "--lock")
    {
      lockPath = argv[index + 1];
      index += 1;
      continue;
    }

    positional.push(argv[index]);
  }

  if (positional.length !== 2)
  {
    throw new Error("用法: node scripts/media-sync.mjs <媒体仓库> <博客目录> [--lock media.lock]");
  }

  return {
    sourceRoot: path.resolve(positional[0]),
    targetRoot: path.resolve(positional[1]),
    lockPath: lockPath ? path.resolve(lockPath) : null,
  };
}

async function sha256File(filePath)
{
  const hash = createHash("sha256");

  await new Promise((resolve, reject) =>
  {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });

  return hash.digest("hex");
}

function validateManifest(manifest)
{
  if (manifest.version !== 1 || !Array.isArray(manifest.files))
  {
    throw new Error("不支持的媒体清单格式");
  }

  let previousPath = "";
  for (const file of manifest.files)
  {
    if (!isManagedMediaPath(file.path))
    {
      throw new Error(`清单包含不允许的路径: ${file.path}`);
    }

    if (file.path <= previousPath)
    {
      throw new Error(`清单路径未严格排序或重复: ${file.path}`);
    }

    if (file.mime !== mediaTypeFor(file.path))
    {
      throw new Error(`清单 MIME 不匹配: ${file.path}`);
    }

    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0 || !/^[0-9a-f]{64}$/.test(file.sha256))
    {
      throw new Error(`清单元数据无效: ${file.path}`);
    }

    previousPath = file.path;
  }
}

const { sourceRoot, targetRoot, lockPath } = parseArguments(process.argv.slice(2));
if (sourceRoot === targetRoot)
{
  throw new Error("媒体仓库和博客目录不能相同");
}

const manifestPath = path.join(sourceRoot, "media-manifest.json");
const manifestText = await readFile(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
validateManifest(manifest);

if (lockPath)
{
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  const manifestHash = createHash("sha256").update(manifestText).digest("hex");
  if (manifestHash !== lock.manifestSha256)
  {
    throw new Error("媒体清单与 media.lock 不匹配");
  }

  const commit = execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  if (commit !== lock.commit)
  {
    throw new Error(`媒体提交不匹配: 期望 ${lock.commit}，实际 ${commit}`);
  }
}

const sourceFiles = await collectManagedFiles(sourceRoot);
const actualPaths = sourceFiles.map((file) => file.relativePath);
const expectedPaths = manifest.files.map((file) => file.path);
if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths))
{
  throw new Error("媒体仓库文件集合与清单不一致");
}

for (let index = 0; index < sourceFiles.length; index += 1)
{
  const actual = sourceFiles[index];
  const expected = manifest.files[index];
  if (actual.stat.size !== expected.bytes || await sha256File(actual.absolutePath) !== expected.sha256)
  {
    throw new Error(`媒体文件校验失败: ${expected.path}`);
  }
}

// 校验全部通过后再替换工作树，避免把半套媒体留给 Hugo。
for (const file of await collectManagedFiles(targetRoot, { allowMissingRoots: true }))
{
  await unlink(file.absolutePath);
}

for (const file of sourceFiles)
{
  const destination = path.join(targetRoot, ...file.relativePath.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(file.absolutePath, destination);
}

const hugoDataPath = path.join(targetRoot, "data", "media.json");
await mkdir(path.dirname(hugoDataPath), { recursive: true });
await writeFile(hugoDataPath, manifestText, "utf8");

console.log(`已同步并校验 ${sourceFiles.length} 个媒体文件`);
