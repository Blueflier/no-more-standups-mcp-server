# Phase II — 🧵 CLI Entrypoint (`nms`)

### 🎯 Outcome:
A basic `nms` CLI executable is available, capable of running via `pnpm nms`. It supports `--help`, `init`, `view`, and `queue` commands with basic argument parsing. Configuration is loaded on startup.

### 📂 File Structure:

packages/cli/
├─ src/
│  ├─ index.ts       # Main CLI entry, yargs setup
│  ├─ commands/
│  │  ├─ init.ts
│  │  ├─ view.ts
│  │  └─ queue.ts
│  └─ utils/
│     └─ logger.ts    # Simple console logger with chalk
├─ tsconfig.json
└─ package.json


### 🔧 Libraries:
- `yargs` (for command-line argument parsing)
- `chalk` (for colorful console output)
- `@no-more-standups/core` (dependency on the local core package)

### ✅ Tasks:
- [ ] Install `yargs` and `chalk` in `packages/cli`.
- [ ] Add `@no-more-standups/core` as a dependency to `packages/cli` using `pnpm add @no-more-standups/core@workspace:*`.
- [ ] In `packages/cli/src/index.ts`:
    - [ ] Add `#!/usr/bin/env node` shebang.
    - [ ] Configure the `bin` field in `packages/cli/package.json` (e.g., `"nms": "./dist/index.js"`).
    - [ ] Import `loadAppConfig` from `@no-more-standups/core/config`.
    - [ ] Attempt to load configuration early. If it fails, log an informative error (e.g., "NMS config not found or invalid at `~/.nms/config.json`. Run `nms setup-config` or create it manually.") and exit, unless the command is meant to create it.
    - [ ] Set up `yargs` instance:
        - [ ] Use `.commandDir('commands')` to load commands from the `commands` directory.
        - [ ] Enable `.strict()` and `.demandCommand()` for better error handling.
        - [ ] Provide `.help()` and `.alias('h', 'help')`.
- [ ] Create `packages/cli/src/commands/init.ts`:
    - [ ] Define command: `init`
    - [ ] Description: "Initializes NMS-Local in the current Git repository."
    - [ ] Handler:
        - [ ] Check if current directory is a Git repository (e.g., look for `.git` folder).
        - [ ] If not, log error using `chalk.red` and exit.
        - [ ] (Placeholder) Log success: `chalk.green("NMS initialized (hook generation pending Phase III).")`
- [ ] Create `packages/cli/src/commands/view.ts`:
    - [ ] Define command: `view [date]`
    - [ ] Description: "Views the NMS log for a specific date (YYYY-MM-DD) or today if no date is provided."
    - [ ] Positional argument `date`: type string, optional.
    - [ ] Handler: (Placeholder) Log `Viewing logs for ${argv.date || 'today'}`.
- [ ] Create `packages/cli/src/commands/queue.ts`:
    - [ ] Define command: `queue <action>`
    - [ ] Description: "Manages the commit processing queue."
    - [ ] Sub-commands using `builder` or separate files:
        - [ ] `ls`: Lists commits in the queue. Handler: (Placeholder) Log "Listing queue."
        - [ ] `rm <sha>`: Removes a commit by its SHA from the queue. Handler: (Placeholder) Log `Removing ${argv.sha} from queue.`
- [ ] Create `packages/cli/src/utils/logger.ts` with simple `log`, `error`, `warn`, `success` functions using `chalk`.
- [ ] Test `pnpm nms --help`, `pnpm nms init`, etc. from the root directory.
