import fs from "node:fs";
import path from "node:path";

export function isDirEmpty(path: string) {
  if (!fs.existsSync(path)) {
    return true;
  }

  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

export function emptyDir(dir: string) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry === ".git") {
      continue;
    }

    const fullPath = path.resolve(dir, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

export function copyDir(src: string, des: string) {
  fs.mkdirSync(des, { recursive: true });

  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.resolve(src, file);
    const destFile = path.resolve(des, file);
    copy(srcFile, destFile);
  }
}

export function copy(src: string, des: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    return copyDir(src, des);
  }
  fs.copyFileSync(src, des);
}

export function getPackage(dir: string) {
  const pkg = fs.readFileSync(
    path.join(dir, "package.json"),
    "utf8",
  );

  return JSON.parse(pkg);
}
