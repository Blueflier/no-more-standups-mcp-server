# Phase X — 🧪 Testing, CI, Docs, and Release

### 🎯 Outcome:
Comprehensive unit and end-to-end tests. CI pipeline via GitHub Actions. Detailed `README.md`. Project published to npm as `no-more-standups-mcp-local`.

### 📂 File Structure:

.github/
  └─ workflows/
     └─ ci.yml
test/
  ├─ fixtures/
  │  └─ sample-repo/  # A minimal Git repo with commit history for testing
  └─ e2e/
     └─ main.e2e.test.ts
README.md
CHANGELOG.md


### 🔧 Libraries:
- `vitest` (already installed)
- `sinon` (for spies, stubs, mocks in unit tests)
- `nock` (for HTTP mocking LLM API calls)
- `tmp-promise` (for creating temporary directories/files in tests)
- `husky` (for Git hooks, e.g., pre-commit linting)
- `lint-staged` (to run linters on staged files)

### ✅ Tasks:
- [ ] Install `sinon`, `nock`, `tmp-promise`, `husky`, `lint-staged` as root dev dependencies.
- [ ] **Comprehensive Unit Tests (Vitest)**:
    - [ ] Review and ensure high coverage for all `core` modules (config, queue, git, ast, llm, writer, hooks, errorLogger). Use `sinon` for mocking complex dependencies and `nock` for all LLM API calls. Use `tmp-promise` for filesystem-dependent tests.
- [ ] **Test Fixture Setup**:
    - [ ] Create a small, representative Git repository under `test/fixtures/sample-repo/`. Include a few commits with diverse changes (JS/TS files, function additions/modifications/deletions, text files, a binary file, a file matching default ignore).
- [ ] **End-to-End (E2E) Test (`test/e2e/main.e2e.test.ts` using Vitest or a shell script)**:
    - [ ] Script to:
        - [ ] Create a temporary Git repository using `tmp-promise`. Copy fixture repo content or create commits programmatically.
        - [ ] Programmatically run `mcp init` (e.g., `execa` or spawn child process).
        - [ ] Verify hook files are created and correct.
        - [ ] Make a new commit in the temp repo. Verify `.mcp_queue` gets an entry.
        - [ ] Programmatically start `mcpd --dry-run` (or with mocked LLM) targeting the temp repo.
        - [ ] Verify daemon processes the queue entry (check console output for dry run, or a mock log file).
        - [ ] (Full test) If not dry run and LLM is mocked: Verify `.mcp_logs/YYYY-MM-DD.md` is created with expected (mocked) summary structure.
        - [ ] Test `mcp queue ls`, `mcp view`, `mcp queue rm`.
        - [ ] Clean up temporary repository.
- [ ] **GitHub Actions CI (`.github/workflows/ci.yml`)**:
    - [ ] Workflow triggers on push/pull_request to main/dev branches.
    - [ ] Matrix strategy for Node.js versions (e.g., 18.x, 20.x) and OS (ubuntu-latest, macos-latest).
    - [ ] Steps: Checkout code, setup pnpm, install dependencies, run linters (`pnpm lint`), run unit tests (`pnpm test:core`), run E2E tests (`pnpm test:e2e`).
    - [ ] (Optional) Add step for test coverage reporting (e.g., to Coveralls or Codecov).
- [ ] **Documentation (`README.md`)**:
    - [ ] Project Title: "No More Standups: MCP-Local"
    - [ ] Badges: CI status (GitHub Actions), npm version, license (e.g., MIT).
    - [ ] Overview: What is MCP-Local? Why use it? (Automated commit summaries to reduce stand-up time).
    - [ ] Features: Automated git hook, commit queue, LLM summarization, local Markdown logs, CLI tools.
    - [ ] Installation: `npm install -g no-more-standups-mcp-local`
    - [ ] Quick Start / Usage:
        - `mcp setup-config` (new command to guide `~/.mcp/config.json` creation).
        - `mcp init` (in your Git repo).
        - `mcpd` (to start the daemon).
        - `mcp view [date]`, `mcp queue ls|rm <sha>`.
    - [ ] Configuration: Details of `~/.mcp/config.json` (providers, API keys, model choices).
    - [ ] `.mcpignore` file usage.
    - [ ] Troubleshooting common issues.
    - [ ] Contributing guidelines.
    - [ ] License.
- [ ] **npm Publishing Preparation**:
    - [ ] Update `package.json` for `packages/cli` (and a root one if creating a monorepo-aware publish script):
        - [ ] `name`: `no-more-standups-mcp-local`
        - [ ] `version`: `0.1.0-beta.0` (or similar starting version).
        - [ ] `author`, `license`, `repository`, `bugs`, `homepage` fields.
        - [ ] Ensure `bin`, `main`, `types`, `files` (include `dist`, `README.md`, `LICENSE`) are correct.
    - [ ] Add `prepublishOnly` script in `packages/cli/package.json` to run `pnpm build`.
    - [ ] Set up `husky` with `lint-staged` for pre-commit hooks (e.g., run `eslint --fix` and `prettier --write`).
    - [ ] Create/Update `CHANGELOG.md`.
    - [ ] Perform a dry run publish: `pnpm publish --dry-run` from `packages/cli` directory.
    - [ ] Publish to npm: `pnpm publish --access public` (from `packages/cli` directory).

---

🏁 **Final Deliverable**:

A working CLI tool, installable via:
`npm install -g no-more-standups-mcp-local`

Users can then run:
1. `mcp setup-config` (guides creation of `~/.mcp/config.json` with API keys etc.)
2. `cd /path/to/your/git/repo`
3. `mcp init`
4. `mcpd` (starts the daemon in the background or a terminal)

Subsequently, after each `git commit`, dev logs will auto-generate at `.mcp_logs/YYYY-MM-DD.md` in their repository, aiming to reduce the need for detailed stand-up report-outs.
