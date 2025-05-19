# Phase VII — 🧠 LLM Summarization

### 🎯 Outcome:
An abstracted LLM service that can take structured diff data, format it into a suitable prompt, send it to a configured LLM provider (OpenAI, Gemini, Claude), and return a Markdown summary. Includes token counting and basic chunking.

### 📂 File Structure:

packages/core/
├─ src/
│  └─ llm/
│     ├─ index.ts            # Main LLM service, provider selection
│     ├─ providers/
│     │  ├─ openai.ts
│     │  ├─ gemini.ts
│     │  └─ claude.ts
│     ├─ promptConstructor.ts # Builds prompts from diff data
│     └─ tokenizer.ts        # Token counting (e.g. tiktoken)


### 🔧 Libraries:
- `openai`, `@google/generative-ai`, `anthropic` (SDKs for LLM providers)
- `tiktoken` (for OpenAI token counting)

### ✅ Tasks:
- [ ] Install `openai`, `@google/generative-ai` (for Gemini), `anthropic` (for Claude), `tiktoken` in `packages/core`.
- [ ] Create `packages/core/src/llm/tokenizer.ts`:
    - [ ] Implement `countTokens(text: string, model: string): number` (initially for OpenAI models using `tiktoken`, can be expanded).
- [ ] Create `packages/core/src/llm/promptConstructor.ts`:
    - [ ] Define `formatDiffForLLM(commitDetails: CommitDetails, diffData: ExtractedDiffData[]): string` to create a concise text representation of changes.
        * Include commit message, author.
        * For each file: path, status.
        * For text files: summary of function changes (added, modified, deleted function names) or raw diff snippet if no function data.
    - [ ] Implement `constructFinalPrompt(formattedDiffText: string, fewShotExamples?: string): string`:
        * System Message: "You are an expert code review assistant. Summarize the following Git commit changes focusing on intent and impact. Output in Markdown."
        * Include `formattedDiffText`.
        * Optionally include few-shot examples for better output quality.
- [ ] Create `packages/core/src/llm/providers/openai.ts` (and similar for `gemini.ts`, `claude.ts`):
    - [ ] Define `async generateOpenAISummary(prompt: string, apiKey: string, model: string): Promise<string>`.
    - [ ] Initialize OpenAI client, make API call, handle response and errors.
- [ ] Create `packages/core/src/llm/index.ts`:
    - [ ] Define `LLMConfig` interface (from `core/config.ts`).
    - [ ] Implement `async generateLLMSummary(diffData: ExtractedDiffData[], commitInfo: CommitDetails, llmConfig: LLMConfig, dryRun: boolean): Promise<string>`:
        - [ ] If `dryRun`, return "DRY RUN: LLM summary would be generated here."
        - [ ] `formattedDiff = promptConstructor.formatDiffForLLM(commitInfo, diffData)`.
        - [ ] `tokenCount = tokenizer.countTokens(formattedDiff, llmConfig.model)`.
        - [ ] **Chunking Logic**: If `tokenCount` > model's limit (e.g., 8k for some, 100k for others - make configurable):
            - [ ] Split `diffData` or `formattedDiff` into smaller chunks (e.g., per file, or by token budget per chunk).
            - [ ] For each chunk: `chunkPrompt = promptConstructor.constructFinalPrompt(chunkFormattedDiff)`.
            - [ ] Call the selected LLM provider for each chunk.
            - [ ] Combine chunk summaries (e.g., concatenate, or use another LLM call to summarize the summaries).
        - [ ] Else (single call): `finalPrompt = promptConstructor.constructFinalPrompt(formattedDiff)`.
        - [ ] Select provider based on `llmConfig.provider` and call its `generateSummary` function.
        -   [ ] `try...catch` LLM API errors. On failure, log via `errorLogger` and return "LLM summarization failed. Please review changes manually."
        - [ ] Return the Markdown summary from the LLM.
- [ ] Unit tests for prompt construction, token counting, and mocking LLM provider calls (`nock`).
