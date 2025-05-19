# Phase VI — 🧩 Git Diff + AST Extractor

### 🎯 Outcome:
Core functions to extract detailed diff information for a commit, including changed files, raw diffs, and structured function-level changes for JS/TS files using AST parsing.

### 📂 File Structure:

packages/core/
├─ src/
│  ├─ gitAnalyzer.ts      # Extracts diffs, changed files using simple-git
│  └─ astParser.ts        # Parses JS/TS, extracts function changes
.mcpignore                 # Optional file in user's repo


### 🔧 Libraries:
- `simple-git` (for interacting with Git repositories)
- `@babel/parser` (for parsing JavaScript/TypeScript into an AST)
- `globby` (for matching files against `.mcpignore` patterns)
- `diff` (npm package for generating text diffs, e.g. for function bodies)

### ✅ Tasks:
- [ ] Install `simple-git`, `@babel/parser`, `globby`, `diff` in `packages/core`.
- [ ] Create `packages/core/src/gitAnalyzer.ts`.
- [ ] Create `packages/core/src/astParser.ts`.
- [ ] In `gitAnalyzer.ts`:
    - [ ] Implement `async getCommitDetails(repoPath: string, sha: string): Promise<{ message: string, author: string, date: string }>` using `simpleGit.log()`.
    - [ ] Implement `async getChangedFilesForCommit(repoPath: string, sha: string): Promise<Array<{ path: string, status: 'A'|'M'|'D'|'R'|'C' }>>`:
        - [ ] Use `simpleGit(repoPath).diffSummary([`${sha}^..${sha}`])` or `show` with name status.
    - [ ] Implement `async loadIgnorePatterns(repoPath: string): Promise<string[]>`:
        - [ ] Reads `.mcpignore` from `repoPath`. If not found, uses default patterns (e.g., `node_modules/**`, `*.lock`, `dist/**`).
        - [ ] Returns array of glob patterns.
    - [ ] Implement `async getFileContentAtCommit(repoPath: string, filePath: string, sha: string): Promise<string | null>`:
        - [ ] Uses `simpleGit(repoPath).show([`${sha}:${filePath}`])`. Handle errors for deleted/new files.
    - [ ] Implement `async getRawFileDiff(repoPath: string, filePath: string, sha: string): Promise<string | null>`:
        - [ ] Uses `simpleGit(repoPath).diff([`${sha}^..${sha}`, '--', filePath])`.
- [ ] In `astParser.ts`:
    - [ ] Define interfaces: `AstFunction { name: string; startLine: number; endLine: number; code: string; params: string[] }`.
    - [ ] Implement `parseCodeToAST(code: string, language: 'javascript' | 'typescript')`: Uses `@babel/parser`.
    - [ ] Implement `extractFunctionsFromAST(ast: BabelNode): AstFunction[]`: Traverses AST (FunctionDeclaration, ArrowFunctionExpression, etc.) to extract function details.
    - [ ] Implement `compareFunctionLists(oldFunctions: AstFunction[], newFunctions: AstFunction[]): Array<{ name: string; status: 'added'|'deleted'|'modified'|'renamed'; oldName?: string; diff?: string; newCode?: string; oldCode?: string; }>`:
        - [ ] Match functions by name (and potentially signature for better rename detection).
        - [ ] For 'modified' functions, use `diff` package (e.g., `Diff.diffLines` or `Diff.structuredPatch`) on `oldCode` vs `newCode`.
- [ ] In `gitAnalyzer.ts`, main function `async extractCommitDiffDetails(repoPath: string, sha: string, parserOptions?: any): Promise<Array<{ filePath: string; status: string; type: 'binary' | 'text' | 'unsupported'; rawDiff?: string; functions?: ReturnType<typeof compareFunctionLists>; }>>`:
    - [ ] `changedFileStats = await getChangedFilesForCommit(repoPath, sha)`.
    - [ ] `ignorePatterns = await loadIgnorePatterns(repoPath)`.
    - [ ] Filter `changedFileStats` using `globby` against `ignorePatterns`.
    - [ ] For each non-ignored `fileStat`:
        - [ ] Determine if file is binary (e.g., via `git diff --numstat` or file extension heuristics). If binary, add `{ filePath, status, type: 'binary' }`.
        - [ ] If text file (JS/TS initially, then others):
            - [ ] `contentBefore = await getFileContentAtCommit(repoPath, fileStat.path, `${sha}^`)`.
            - [ ] `contentAfter = await getFileContentAtCommit(repoPath, fileStat.path, sha)`.
            - [ ] If JS/TS file:
                - [ ] `astBefore = astParser.parseCodeToAST(contentBefore || '', lang)`.
                - [ ] `astAfter = astParser.parseCodeToAST(contentAfter || '', lang)`.
                - [ ] `functionsBefore = astParser.extractFunctionsFromAST(astBefore)`.
                - [ ] `functionsAfter = astParser.extractFunctionsFromAST(astAfter)`.
                - [ ] `functionChanges = astParser.compareFunctionLists(functionsBefore, functionsAfter)`.
                - [ ] Add `{ filePath, status, type: 'text', functions: functionChanges }`.
            - [ ] Else (other text file or AST parsing failed):
                - [ ] `rawFileDiff = await getRawFileDiff(repoPath, fileStat.path, sha)`.
                - [ ] Add `{ filePath, status, type: 'unsupported', rawDiff }`.
    - [ ] Return the array of detailed diffs.
- [ ] Unit tests for git interactions (mock `simple-git`) and AST parsing/diffing logic.
