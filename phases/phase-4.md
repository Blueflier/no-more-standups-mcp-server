# Phase IV — 📦 Queue System + Rate Limiting (Core Logic)

### 🎯 Outcome:
Core package provides a `QueueManager` class with file locking and NDJSON format for `.nms_queue`. Basic rate limiting logic for processing is defined.

### 📂 File Structure:

packages/core/
├─ src/
│  └─ queueManager.ts   # Handles .mcp_queue operations, locking, rate limits
.nms_queue                # File created in repo root by hook runner


### 🔧 Libraries:
- `proper-lockfile` (for file-based locking of `.nms_queue`)
- `dayjs` (for time/date manipulations, especially for rate limiting)
- `fs-extra` (already installed)

### ✅ Tasks:
- [ ] Install `proper-lockfile`, `dayjs` in `packages/core`.
- [ ] Create `packages/core/src/queueManager.ts`.
- [ ] Define constants: `QUEUE_FILENAME = '.mcp_queue'`, `RATE_LIMIT_COUNT = 3`, `RATE_LIMIT_WINDOW_MINUTES = 1`.
- [ ] Define TypeScript interface: `interface QueueEntry { sha: string; time: string; status: 'queued' | 'processing' | 'failed'; retries?: number; }`.
- [ ] Implement `async getQueueFilePath(repoPath: string): Promise<string>` (resolves to `path.join(repoPath, QUEUE_FILENAME)`).
- [ ] Implement `async getQueueEntries(repoPath: string): Promise<QueueEntry[]>`:
    - [ ] Get queue file path.
    - [ ] If file doesn't exist, return `[]`.
    - [ ] Acquire read lock using `proper-lockfile.readFile(queuePath, { lock: true })`.
    - [ ] Read file content. Split by newline, filter empty lines, parse each line as JSON into `QueueEntry[]`.
    - [ ] Return entries. Handle parse errors for individual lines gracefully (e.g., log and skip).
- [ ] Implement `async writeQueueEntries(repoPath: string, entries: QueueEntry[]): Promise<void>`:
    - [ ] Get queue file path.
    - [ ] Acquire write lock using `proper-lockfile.writeFile(queuePath, content, { lock: true })`.
    - [ ] Convert `entries` array to NDJSON string.
    - [ ] Write content to queue file.
- [ ] Implement `async enqueueCommit(repoPath: string, sha: string, time: string): Promise<void>` (This is what the hook runner effectively does, but this provides a core utility if needed elsewhere. The hook runner is simpler for now).
    - [ ] Get queue file path.
    - [ ] Create `QueueEntry`.
    - [ ] Acquire lock, append entry to `.mcp_queue` using `fs-extra.appendFile` (ensure atomicity or use `proper-lockfile` for append if available/needed).
- [ ] Implement `async dequeueBatch(repoPath: string, batchSize: number): Promise<QueueEntry[]>`:
    - [ ] `allEntries = await getQueueEntries(repoPath)`.
    - [ ] Filter for entries with `status: 'queued'`.
    - [ ] Select up to `batchSize` entries from the start of the filtered list.
    - [ ] If no processable entries, return `[]`.
    - [ ] Update the status of selected entries to `'processing'` in `allEntries`.
    - [ ] `await writeQueueEntries(repoPath, allEntries)` (to mark them as being processed).
    - [ ] Return the selected batch.
- [ ] Implement `async updateQueueEntryStatus(repoPath: string, sha: string, status: QueueEntry['status'], retries?: number): Promise<void>`:
    - [ ] Updates a specific entry's status/retries. Reads, modifies, writes queue.
- [ ] Implement `async removeCommitFromQueue(repoPath: string, shaToRemove: string): Promise<boolean>`:
    - [ ] `entries = await getQueueEntries(repoPath)`.
    - [ ] Filter out the entry where `entry.sha === shaToRemove`.
    - [ ] If an entry was removed, `await writeQueueEntries(repoPath, filteredEntries)` and return `true`.
    - [ ] Else, return `false`.
- [ ] Implement `async isRateLimitExceededForProcessing(repoPath: string, processedHistory: Array<{ time: string }>): Promise<boolean>`:
    -   [ ] Get current time using `dayjs()`.
    -   [ ] Filter `processedHistory` for items processed within the last `RATE_LIMIT_WINDOW_MINUTES`.
    -   [ ] If count of these recent items >= `RATE_LIMIT_COUNT`, return `true`.
    -   [ ] Else, return `false`.
    * (Note: `processedHistory` needs to be managed by the daemon, perhaps from logs or a state file).
- [ ] Write unit tests for all queue management functions in `packages/core/src/queueManager.test.ts`. Mock `fs-extra`, `proper-lockfile`, `dayjs`. Test empty queue, adding, dequeuing, removing, concurrent access scenarios (if mockable with `proper-lockfile`).
