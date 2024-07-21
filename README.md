> [!WARNING]
> This CLI is still a work in progress and might not have all the features listed below.

Personal CLI for setting up pre-configured projects based on my preferences, including Vue or React frameworks, ESLint with custom rules, and Git hooks with Lefthook.

## Features

- **Frameworks**: Choose between `Vue` or `React`.
- **ESLint**: Based on `@antfu/eslint-config` with minor personal tweaks.
- **Router**: Pre-configured with `react-router-dom` for React or `vue-router` for Vue.
- **Git Hooks**: `lefthook` for pre-commit hooks.

## Usage

For one time use of the command, run the following command:

```bash
npx @moaqz/create-app
```

To install the command globally, run the following command:

```bash
npm install -g @moaqz/create-app
@moaqz/create-app
```

## Contributing

> [!IMPORTANT]
> I'm open to suggestions and bug fixes, but keep in mind this is a personal tool. Its main goal is to provide a base for my projects, based on my preferences and the tools I use on a daily basis.
