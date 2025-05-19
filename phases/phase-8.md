# Phase VIII — 📝 Markdown Log Writer

### 🎯 Outcome:
A function that takes commit details and an LLM-generated summary, formats them with YAML front-matter per entry, and appends to a daily Markdown log file (`.mcp_logs/YYYY-MM-DD.md`).

### 📂 File Structure:

packages/core/
├─ src/
│  └─ logWriter.ts        # Writes summaries to Markdown files
.mcp_logs/                 # Directory created in user's repo
  └─ YYYY-MM-DD.md        # Daily log file


### 🔧 Libraries:
- `fs-extra` (already installed)
- `dayjs` (already installed)
- `js-yaml` (for serializing YAML front-matter)

### ✅ Tasks:
- [ ] Install `js-yaml` in `packages/core`.
- [ ] Create `packages/core/src/logWriter.ts`.
- [ ] Implement `async writeMarkdownLogEntry(repoPath: string, commitInfo: { sha: string; time: string; message: string; author: string; }, summaryText: string, llmMeta: { model: string; tokens?: number; provider: string; }, filesChangedCount: number, dryRun: boolean): Promise<void>`:
    - [ ] If `dryRun`, log "DRY RUN: Markdown log entry would be written" and return.
    - [ ] Determine log file directory: `logDir = path.join(repoPath, '.mcp_logs')`.
    - [ ] Ensure `logDir` exists using `fs-extra.ensureDir()`.
    - [ ] Determine log file name: `logFilename = `${dayjs(commitInfo.time).format('YYYY-MM-DD')}.md``.
    - [ ] `logFilePath = path.join(logDir, logFilename)`.
    - [ ] Prepare front-matter object:
        ```javascript
        const frontMatter = {
          commit: commitInfo.sha,
          author: commitInfo.author,
          time: dayjs(commitInfo.time).toISOString(), // Full ISO timestamp
          model: llmMeta.model,
          provider: llmMeta.provider,
          tokens: llmMeta.tokens,
          files_changed: filesChangedCount,
        };
        ```
    - [ ] Serialize front-matter to YAML string: `yamlFrontMatter = yaml.dump(frontMatter)`.
    - [ ] Format the full log entry string:
        ```markdown
        ---
        ${yamlFrontMatter}---

        ### ${commitInfo.sha} - ${commitInfo.message}

        ${summaryText}

        ---
        ```
        (Note: The final `---` acts as a separator between entries).
    - [ ] Append the `logEntryString` to `logFilePath` using `fs-extra.appendFile()`. Add a newline before appending if file is not empty.
    - [ ] Log success: "Summary for commit ${commitInfo.sha} written to ${logFilePath}".
- [ ] Unit tests for `writeMarkdownLogEntry`: mock `fs-extra`, `dayjs`, `js-yaml`. Verify correct file path, directory creation, and content format.
