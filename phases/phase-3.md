# Phase III — 🔗 Post-Commit Hook Generator

### 🎯 Outcome:
The `nms init` command successfully creates a `.git/hooks/post-commit` script and a helper Node.js runner script (`.git/.nms_hook_runner.js`) that queues the latest commit SHA.

### 📂 File Structure:

packages/core/
├─ src/
│  └─ hookGenerator.ts  # Logic for creating/managing Git hooks
# Files created by `nms init` in a target Git repo:
# .git/hooks/post-commit
# .git/.nms_hook_runner.js


### 🔧 Libraries:
- `fs-extra` (for robust file system operations in core)

### ✅ Tasks:
- [ ] Install `fs-extra` in `packages/core`.
- [ ] Create `packages/core/src/hookGenerator.ts`.
- [ ] Implement `async setupPostCommitHook(repoPath: string): Promise<void>` in `hookGenerator.ts`:
    - [ ] Verify `repoPath` contains a `.git` directory. If not, throw an error.
    - [ ] Define `hookDirPath = path.join(repoPath, '.git', 'hooks')` and `runnerPath = path.join(repoPath, '.git', '.nms_hook_runner.js')`.
    - [ ] Ensure `hookDirPath` exists using `fs-extra.ensureDir()`.
    - [ ] **Generate `.nms_hook_runner.js` content**:
        ```javascript
        // Content for .git/.nms_hook_runner.js
        const fs = require('fs');
        const path = require('path');
        const { execSync } = require('child_process');
        const nmsQueueFile = path.join(process.cwd(), '.nms_queue'); // Assumes .nms_queue is in repo root
        try {
            const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
            const timestamp = new Date().toISOString();
            // NDJSON format for the queue
            const queueEntry = JSON.stringify({ sha: commitSha, time: timestamp, status: 'queued' }) + '\n';
            fs.appendFileSync(nmsQueueFile, queueEntry);
            console.log('[NMS-Local] Commit enqueued:', commitSha);
        } catch (err) {
            const errorLogDir = path.join(require('os').homedir(), '.nms', 'errors');
            fs.mkdirSync(errorLogDir, { recursive: true });
            const errorLogFile = path.join(errorLogDir, 'hook-errors.log');
            fs.appendFileSync(errorLogFile, `[${new Date().toISOString()}] Failed to enqueue commit: ${err.message}\nStack: ${err.stack}\n`);
            console.error('[NMS-Local] Error enqueuing commit. See ~/.nms/errors/hook-errors.log');
            process.exit(1); // Exit with error to signal git post-commit failure if desired
        }
        ```
    - [ ] Write the runner script content to `runnerPath` using `fs-extra.writeFile()`.
    - [ ] **Generate `post-commit` hook script content**:
        ```bash
        #!/bin/sh
        # NMS-Local HOOK - Managed by No More Standups: NMS-Local
        # This hook triggers the NMS commit processor helper.

        echo "[NMS-Local] Post-commit hook triggered..."
        # Ensures Node is in PATH. Uses the .git relative path for the runner.
        node "$(dirname "$0")/.nms_hook_runner.js"
        exit 0 # Always exit 0 from post-commit unless you want to block something
        ```
    - [ ] Define `postCommitHookPath = path.join(hookDirPath, 'post-commit')`.
    - [ ] Check if `post-commit` already exists:
        - [ ] If yes, read its content. If it doesn't contain `# NMS-Local HOOK`, back it up to `post-commit.nms-backup-[timestamp]` and inform the user.
    - [ ] Write the hook script content to `postCommitHookPath` using `fs-extra.writeFile()`.
    - [ ] Make the `postCommitHookPath` executable using `fs-extra.chmod(postCommitHookPath, 0o755)`.
- [ ] Update `packages/cli/src/commands/init.ts` handler:
    - [ ] Call `await core.setupPostCommitHook(process.cwd())`.
    - [ ] Log success/failure messages using `chalk`.
