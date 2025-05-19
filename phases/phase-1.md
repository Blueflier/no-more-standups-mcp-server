# Phase I — 🏗 Monorepo Setup & Config Loader

### 🎯 Outcome:
Monorepo initialized with pnpm workspaces, TypeScript, ESLint/Prettier, and a global configuration loader for `~/.nms/config.json`. Core package can load and validate this configuration.

### 📂 File Structure:
nms-local/
├─ packages/
│  ├─ cli/
│  │  ├─ src/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ core/
│     ├─ src/
│     │  ├─ index.ts
│     │  └─ config.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ pnpm-workspace.yaml
└─ package.json


### 🔧 Libraries:
- `typescript`, `ts-node`, `@types/node` (root dev)
- `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` (root dev)
- `vitest` (root dev for testing core logic)

### ✅ Tasks:
- [x] Initialize root `package.json` using `pnpm init`.
- [ ] Create `pnpm-workspace.yaml` and define `packages/*` as workspaces.
- [ ] Create `packages/cli` and `packages/core` directories.
- [ ] Initialize `package.json` within `packages/cli` and `packages/core` respectively.
- [ ] Install `typescript`, `ts-node`, `@types/node` as dev dependencies in the root project.
- [ ] Create `tsconfig.json` in `packages/cli` configured for ESM output (e.g., `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `outDir`).
- [ ] Create `tsconfig.json` in `packages/core` configured for ESM output and declaration files.
- [ ] Add basic `src/index.ts` (e.g., `export const coreLib = () => 'core';`) to `packages/core`.
- [ ] Add basic `src/index.ts` (e.g., `console.log('cli');`) to `packages/cli`.
- [ ] Install `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` as root dev dependencies.
- [ ] Create a root `.eslintrc.cjs` configured for TypeScript and Prettier integration.
- [ ] Create a root `.prettierrc` with preferred formatting rules (e.g., single quote, semi).
- [ ] Add `lint` and `format` scripts to the root `package.json`.
- [ ] Add build scripts to `packages/core/package.json` and `packages/cli/package.json` (e.g., `tsc`).
- [ ] In `packages/core/src/config.ts`:
    - [ ] Define a TypeScript interface for the expected structure of `~/.mcp/config.json` (e.g., `LLMProviderConfig { apiKey: string; model: string; provider: 'openai' | 'gemini' | 'claude'; }`, `user { name?: string; email?: string; }`).
    - [ ] Implement `loadAppConfig(): YourConfigInterface` function:
        - [ ] Determine user's home directory path (e.g., using `os.homedir()`).
        - [ ] Construct the full path to `~/.mcp/config.json`.
        - [ ] Read the file content using `fs.promises.readFile`.
        - [ ] Parse the JSON content.
        - [ ] Validate the parsed object against the defined TypeScript interface (e.g., check for required fields, correct types).
        - [ ] Return the typed configuration object.
        - [ ] Throw a custom error (e.g., `ConfigError`) if the file is not found, is not valid JSON, or fails type validation.
- [ ] Install `vitest` in the root for testing.
- [ ] Write unit tests in `packages/core/src/config.test.ts` for `loadAppConfig()`:
    - [ ] Test case: Config file exists and is valid.
    - [ ] Test case: Config file does not exist.
    - [ ] Test case: Config file is malformed JSON.
    - [ ] Test case: Config file is missing required fields.
