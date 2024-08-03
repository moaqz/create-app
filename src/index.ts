import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import consola from "consola";
import { copy, emptyDir, getPackage } from "./utils";
import { getUserInputs } from "./prompt";

const RENAME_FILES: Record<string, string> = {
  _gitignore: ".gitignore",
};

async function createApp() {
  const {
    framework,
    name,
    overwrite,
    eslint,
  } = await getUserInputs();

  if (overwrite) {
    emptyDir(name);
  }

  const template = framework;
  const rootDir = path.resolve(process.cwd(), name);
  const srcDir = path.dirname(fileURLToPath(import.meta.url));
  const eslintDir = path.resolve(srcDir, "eslint");
  const templateDir = path.resolve(srcDir, `template-${template}`);

  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  const files = fs.readdirSync(templateDir);
  for (const file of files) {
    if (file === "package.json") {
      continue;
    }

    const srcFile = path.resolve(templateDir, file);
    const destFile = path.resolve(rootDir, RENAME_FILES[file] ?? file);
    copy(srcFile, destFile);
  }

  const pkg = getPackage(templateDir);
  pkg.name = name;

  if (eslint) {
    const eslintPkg = getPackage(eslintDir);

    pkg.devDependencies = {
      ...eslintPkg.devDependencies,
      ...pkg.devDependencies,
    };

    pkg.scripts = {
      ...eslintPkg.scripts,
      ...pkg.scripts,
    };

    const files = fs.readdirSync(eslintDir);
    for (const file of files) {
      if (file === "package.json") {
        continue;
      }

      const srcFile = path.resolve(eslintDir, file);
      const destFile = path.resolve(rootDir, file);
      copy(srcFile, destFile);
    }
  }

  const pkgFile = path.resolve(rootDir, "package.json");
  fs.writeFileSync(
    pkgFile,
    `${JSON.stringify(pkg, null, 2)}\n`,
  );

  consola.success(` Ready! To get started, run the following commands:\n
    cd ${name}
    git init
    pnpm install
  `);
}

createApp().catch((err) => {
  consola.fatal(err);
});
