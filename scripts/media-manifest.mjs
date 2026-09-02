#!/usr/bin/env node

import path from "node:path";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { collectManagedFiles, mediaTypeFor } from "./lib/media-paths.mjs";

const GITHUB_BLOB_LIMIT = 100 * 1024 * 1024;
const sourceRoot = path.resolve(process.argv[2] ?? ".");
const outputPath = path.resolve(process.argv[3] ?? path.join(sourceRoot, "media-manifest.json"));

async function sha256(filePath)
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

const files = [];
for (const file of await collectManagedFiles(sourceRoot))
{
  if (file.stat.size > GITHUB_BLOB_LIMIT)
  {
    throw new Error(`文件超过 GitHub 普通 Git 的 100 MiB 上限: ${file.relativePath}`);
  }

  files.push({
    path: file.relativePath,
    bytes: file.stat.size,
    sha256: await sha256(file.absolutePath),
    mime: mediaTypeFor(file.relativePath),
  });
}

const manifest = `${JSON.stringify({ version: 1, files }, null, 2)}\n`;
await writeFile(outputPath, manifest, "utf8");

const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
console.log(`已写入 ${files.length} 个媒体文件，共 ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
