# Phase IX — 🛠 CLI Utilities & Local View Tools

### 🎯 Outcome:
Enhanced `mcp` CLI commands: `view` opens the relevant log file, `queue ls` displays current queue, and `queue rm` removes entries. Errors are consistently logged.

### 📂 File Structure:

packages/cli/
├─ src/
│  └─ commands/
│     ├─ view.ts     # Updated view command
│     └─ queue.ts    # Updated queue command (ls, rm)


### 🔧 Libraries:
- `open` (to open files with default application)
- `@no-more-standups/core` (queueManager, errorLogger)

### ✅ Tasks:
- [ ] Install `open` in `packages/cli`.
- [ ] Update `packages/cli/src/commands/view.ts`:
    - [ ] Handler logic:
        - [ ] `repoPath = path.resolve(argv.repoPath || process.cwd())`.
        - [ ] `dateToView = argv.date ? dayjs(argv.date) : dayjs()`. Ensure valid date input.
        - [ ] `logFileName = `${dateToView.format('YYYY-MM-DD')}.md``.
        - [ ] `logFilePath = path.join(repoPath, '.mcp_logs', logFileName)`.
        - [ ] Check if `logFilePath` exists using `fs-extra.pathExists()`.
        - [ ] If exists, `await open(logFilePath)`.
        - [ ] If not, log error: "Log file not found for ${dateToView.format('YYYY-MM-DD')} at ${logFilePath}".
- [ ] Update `packages/cli/src/commands/queue.ts` for `ls` and `rm` subcommands:
    - [ ] `ls` handler:
        - [ ] `repoPath = path.resolve(argv.repoPath || process.cwd())`.
        - [ ] `entries = await core.getQueueEntries(repoPath)`.
        - [ ] If `entries.length === 0`, log "Commit queue is empty."
        - [ ] Else, format and print entries (SHA, Queued Time, Status) using `console.table` or custom formatting with `chalk`.
    - [ ] `rm <sha>` handler:
        - [ ] `repoPath = path.resolve(argv.repoPath || process.cwd())`.
        - [ ] `shaToRemove = argv.sha`.
        - [ ] `wasRemoved = await core.removeCommitFromQueue(repoPath, shaToRemove)`.
        - [ ] If `wasRemoved`, log success: "Commit ${shaToRemove} removed from queue."
        - [ ] Else, log error: "Commit ${shaToRemove} not found in queue."
- [ ] Ensure all CLI command handlers use the `core.errorLogger` for unexpected errors.
