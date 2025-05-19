# Phase V — 🚦 NMS Daemon (`nmsd`)

### 🎯 Outcome:
A persistent `nmsd` CLI daemon that watches `.nms_queue` for changes. When new commits are added, it dequeues them respecting rate limits, and (placeholder) processes them. Supports dry-run mode and logs errors.

### 📂 File Structure:

packages/cli/
├─ src/
│  ├─ commands/
│  │  └─ daemon.ts    # mcpd command logic
packages/core/
├─ src/
│  ├─ daemonProcessor.ts # Core logic for processing a single commit
│  └─ errorLogger.ts     # Utility for logging errors to a file


### 🔧 Libraries:
- `chokidar` (for watching file system changes on `.mcp_queue`)
- `is-online` (to check internet connectivity before LLM calls)
- `@no-more-standups/core` (queueManager, etc.)

### ✅ Tasks:
- [ ] Install `chokidar`, `is-online` in `packages/cli`.
- [ ] Create `packages/core/src/errorLogger.ts`:
    - [ ] Implement `async logErrorToFile(component: string, errorMessage: string, stack?: string, details?: object)`:
        - [ ] Creates/appends to `~/.mcp/logs/mcp-errors-YYYY-MM-DD.log`.
        - [ ] Formats log entry with timestamp, component, message, stack, details.
- [ ] Create `packages/core/src/daemonProcessor.ts`:
    - [ ] Implement `async processSingleCommitEntry(repoPath: string, commitEntry: QueueEntry, config: AppConfig, options: { dryRun: boolean }): Promise<void>`:
        - [ ] Log `Processing commit: ${commitEntry.sha}`.
        - [ ] **Integration Point for Phases VI-VIII**:
            - [ ] `diffData = await core.extractCommitDiffDetails(repoPath, commitEntry.sha, config.parserOptions)` (Phase VI).
            - [ ] `summary = await core.generateLLMSummary(diffData, commitEntry, config.llmConfig, options.dryRun)` (Phase VII).
            - [ ] `await core.writeMarkdownLog(repoPath, commitEntry, summary, { model: config.llmConfig.model /*, tokens*/ }, diffData.length, options.dryRun)` (Phase VIII).
        - [ ] If `options.dryRun`:
            - [ ] Log to console: `[DRY RUN] Would process commit ${commitEntry.sha}. Summary: ${summaryPlaceholder}`.
            - [ ] Do not make actual LLM calls or write to the main log file.
        - [ ] If successful, call `core.updateQueueEntryStatus(repoPath, commitEntry.sha, 'processed')` or remove from queue.
        - [ ] `try...catch` processing errors:
            - [ ] If error, call `core.logErrorToFile('DaemonProcessor', error.message, error.stack, { commitSha: commitEntry.sha })`.
            - [ ] Implement retry logic: Increment `commitEntry.retries`. Call `core.updateQueueEntryStatus(repoPath, commitEntry.sha, 'failed', newRetries)`. If max retries (e.g., 3) exceeded, mark as permanently failed.
- [ ] Create `packages/cli/src/commands/daemon.ts` for the `mcpd` command:
    - [ ] Define command: `daemon` (or `mcpd` if preferred as a separate binary via `package.json` bin).
    - [ ] Options: `--dry-run` (boolean), `--repo-path <path>` (string, default `process.cwd()`).
    - [ ] Handler `async startDaemon(argv)`:
        - [ ] Load app config using `core.loadAppConfig()`.
        - [ ] `repoPath = path.resolve(argv.repoPath)`.
        - [ ] Initialize `processedCommitTimestamps: string[] = []` (in-memory for rate limiting, or load from a persistent state).
        - [ ] Define `async function triggerProcessing()`:
            - [ ] `canProcess = await core.isOnline()`. If not, log "Offline, skipping processing cycle." and return.
            - [ ] `isLimited = await core.isRateLimitExceededForProcessing(repoPath, processedCommitTimestamps.map(t => ({time: t})))`. If true, log "Rate limit active, skipping." and return.
            - [ ] `batch = await core.dequeueBatch(repoPath, 1)` (process one by one).
            - [ ] If `batch.length === 0`, return.
            - [ ] For `commitEntry` in `batch`:
                - [ ] `await core.processSingleCommitEntry(repoPath, commitEntry, appConfig, { dryRun: argv.dryRun })`.
                - [ ] If successful processing (not dry run), add `new Date().toISOString()` to `processedCommitTimestamps`. Keep this list trimmed to the rate limit window.
        - [ ] Use `chokidar` to watch `path.join(repoPath, '.mcp_queue')`.
            - [ ] On `add` and `change` events, call `triggerProcessing()`.
            - [ ] Log "MCP Daemon started. Watching for commits..."
        - [ ] Initial call to `triggerProcessing()` on daemon startup.
        - [ ] Implement graceful shutdown (e.g., `process.on('SIGINT', ...)`) to stop chokidar watcher.
