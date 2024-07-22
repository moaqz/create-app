import process from "node:process";
import { consola } from "consola";
import { isDirEmpty } from "./utils";

const FRAMEWORKS = [
  {
    label: "Vue",
    value: "vue",
  },
];

/**
 * Wrapper to exit the process if the user presses CTRL+C.
 * https://github.com/unjs/consola/issues/251#issuecomment-1778771579
 */
const prompt: typeof consola.prompt = async (message, options) => {
  const response = await consola.prompt(message, options);
  if (response.toString() === "Symbol(clack:cancel)") {
    process.exit(0);
  }
  return response;
};

export async function getUserInputs() {
  const projectName = await prompt("Project name", {
    placeholder: "Project name",
    required: true,
    type: "text",
  });

  const targetDir = projectName;

  let overwrite = false;
  if (!isDirEmpty(targetDir)) {
    const message = projectName === "."
      ? "Current directory is not empty. Please choose how to proceed:"
      : `Target directory ${projectName} is not empty. Please choose how to proceed:`;

    const option = await prompt(message, {
      required: true,
      type: "select",
      options: [
        {
          label: "Remove existing files and continue",
          value: "yes",
        },
        {
          label: "Cancel operation",
          value: "no",
        },
      ],
      initial: "yes",
    });

    if (option.value === "no") {
      consola.info("Operation cancelled");
      process.exit(0);
    }

    overwrite = true;
  }

  const framework = await prompt("Select a framework", {
    required: true,
    type: "select",
    options: FRAMEWORKS,
  });

  const eslint = await prompt("Add ESLint for code quality?", {
    required: true,
    type: "confirm",
    initial: true,
  });

  return {
    name: projectName,
    overwrite,
    framework,
    eslint,
  };
}
