import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import consola from "consola";
import { getUserInputs } from "./prompt";
import { copy, emptyDir, getPackage } from "./utils";

const RENAME_FILES: Record<string, string> = {
  _gitignore: ".gitignore",
};

async function createApp() {
  const { framework, name, overwrite, linter, gitHooks }
    = await getUserInputs();

  if (overwrite) {
    emptyDir(name);
  }

  const template = framework;
  const rootDir = path.resolve(process.cwd(), name);
  const srcDir = path.dirname(fileURLToPath(import.meta.url));
  const eslintDir = path.resolve(srcDir, "eslint");
  const biomeDir = path.resolve(srcDir, "biome");
  const gitHooksDir = path.resolve(srcDir, "git-hooks");
  const templateDir = path.resolve(srcDir, `template-${template}`);
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  const linterDir = linter === "biome" ? biomeDir : eslintDir;

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

  if (linter) {
    const linterPkg = getPackage(linterDir);

    pkg.devDependencies = {
      ...linterPkg.devDependencies,
      ...pkg.devDependencies,
    };

    pkg.scripts = {
      ...linterPkg.scripts,
      ...pkg.scripts,
    };

    const files = fs.readdirSync(linterDir);
    for (const file of files) {
      if (file === "package.json") {
        continue;
      }

      const srcFile = path.resolve(linterDir, file);
      const destFile = path.resolve(rootDir, file);
      copy(srcFile, destFile);
    }
  }

  if (gitHooks) {
    const hooksPkg = getPackage(gitHooksDir);

    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...hooksPkg.devDependencies,
    };

    const files = fs.readdirSync(gitHooksDir);
    for (const file of files) {
      if (file === "package.json") {
        continue;
      }

      const srcFile = path.resolve(gitHooksDir, file);
      const destFile = path.resolve(rootDir, file);
      copy(srcFile, destFile);
    }
  }

  const pkgFile = path.resolve(rootDir, "package.json");
  fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`);

  consola.success(` Ready! To get started, run the following commands:\n
    cd ${name}
    git init
    pnpm install
    ${gitHooks ? "pnpm lefthook install" : ""}
  `);
}

createApp().catch((err) => {
  consola.fatal(err);
});
