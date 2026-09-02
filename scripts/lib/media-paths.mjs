import path from "node:path";
import { readdir, lstat } from "node:fs/promises";

export const MEDIA_ROOTS = Object.freeze([
  "static/images/bg",
  "static/images/covers",
  "static/audio",
  "content/post",
]);

export const MEDIA_TYPES = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".m4a", "audio/mp4"],
  [".mp3", "audio/mpeg"],
  [".mp4", "video/mp4"],
  [".ogg", "audio/ogg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".wav", "audio/wav"],
  [".webm", "video/webm"],
  [".webp", "image/webp"],
]);

export function toPosixPath(value)
{
  return value.split(path.sep).join("/");
}

export function mediaTypeFor(relativePath)
{
  return MEDIA_TYPES.get(path.posix.extname(relativePath).toLowerCase());
}

export function isManagedMediaPath(relativePath)
{
  if (relativePath.startsWith("/") || relativePath.includes("\0"))
  {
    return false;
  }

  const normalized = path.posix.normalize(relativePath);
  if (normalized !== relativePath || normalized.startsWith("../"))
  {
    return false;
  }

  if (!mediaTypeFor(relativePath))
  {
    return false;
  }

  return MEDIA_ROOTS.some((root) => relativePath.startsWith(`${root}/`));
}

export async function collectManagedFiles(sourceRoot, { allowMissingRoots = false } = {})
{
  const files = [];

  async function visit(absoluteDirectory)
  {
    const entries = await readdir(absoluteDirectory, { withFileTypes: true });
    entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);

    for (const entry of entries)
    {
      const absolutePath = path.join(absoluteDirectory, entry.name);
      const relativePath = toPosixPath(path.relative(sourceRoot, absolutePath));

      if (entry.isSymbolicLink())
      {
        throw new Error(`媒体目录不允许符号链接: ${relativePath}`);
      }

      if (entry.isDirectory())
      {
        await visit(absolutePath);
        continue;
      }

      if (!entry.isFile())
      {
        throw new Error(`媒体目录包含不支持的文件类型: ${relativePath}`);
      }

      if (isManagedMediaPath(relativePath))
      {
        const stat = await lstat(absolutePath);
        files.push({ absolutePath, relativePath, stat });
      }
      else if (!relativePath.startsWith("content/post/"))
      {
        throw new Error(`媒体目录包含不支持的文件: ${relativePath}`);
      }
    }
  }

  for (const root of MEDIA_ROOTS)
  {
    const absoluteRoot = path.join(sourceRoot, ...root.split("/"));
    let rootStat;

    try
    {
      rootStat = await lstat(absoluteRoot);
    }
    catch (error)
    {
      if (allowMissingRoots && error.code === "ENOENT")
      {
        continue;
      }

      throw error;
    }

    if (rootStat.isSymbolicLink())
    {
      throw new Error(`媒体根目录不允许符号链接: ${root}`);
    }

    if (!rootStat.isDirectory())
    {
      throw new Error(`媒体根路径不是目录: ${root}`);
    }

    await visit(absoluteRoot);
  }

  files.sort((left, right) => left.relativePath < right.relativePath ? -1 : left.relativePath > right.relativePath ? 1 : 0);
  return files;
}
