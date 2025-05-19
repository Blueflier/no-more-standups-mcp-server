# No More Standups

Automate your standups and save time for meaningful work.

## Overview

No More Standups is a tool that helps you automate the creation and management of standup updates. It uses AI to generate meaningful, context-aware status updates by analyzing your git commits, JIRA/GitHub issues, and other work artifacts.

## Installation

### Prerequisites

- Node.js 18+ 
- pnpm 10+

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/no-more-standups.git
   cd no-more-standups
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the packages:
   ```bash
   pnpm build
   ```

### Global Installation (for development)

To use the CLI globally during development:

```bash
cd packages/cli
pnpm link --global
```

Then you can use the `nms` command from anywhere.

## Usage

### Running the CLI

After building the packages, you can run the CLI directly:

```bash
node packages/cli/dist/index.js
```

Note: You need to create a configuration file first (see Configuration section below) or you'll get a "Config file not found" error.

### Development Commands

For development, use these commands from the project root:

```bash
# From the root directory
pnpm build     # Build all packages
pnpm test      # Run tests
pnpm lint      # Run linting
pnpm format    # Format code
pnpm cli:dev   # Run the CLI in dev mode (recommended)
```

Alternatively, you can run the dev command directly from the CLI package:

```bash
# From the CLI package directory
cd packages/cli
pnpm dev
```

## Configuration

Before running the CLI, create a configuration file at `~/.nms/config.json` with the following structure:

```json
{
  "llmProvider": {
    "apiKey": "your-api-key",
    "model": "gpt-4",
    "provider": "openai"
  },
  "user": {
    "name": "Your Name",
    "email": "your-email@example.com"
  }
}
```

You can create this file with:

```bash
mkdir -p ~/.nms
```

Then create the file `~/.nms/config.json` with your editor, or use:

```bash
cat > ~/.nms/config.json << EOF
{
  "llmProvider": {
    "apiKey": "your-api-key",
    "model": "gpt-4",
    "provider": "openai"
  },
  "user": {
    "name": "Your Name",
    "email": "your-email@example.com"
  }
}
EOF
```

Supported providers:
- `openai`
- `gemini`
- `claude`

## Development

### Project Structure

```
no-more-standups/
├─ packages/
│  ├─ cli/        # Command-line interface
│  │  ├─ src/
│  │  └─ ...
│  └─ core/       # Core functionality
│     ├─ src/
│     └─ ...
└─ ...
```

### Available Scripts

- Build all packages:
  ```bash
  pnpm build
  ```

- Run tests:
  ```bash
  pnpm test
  ```

- Lint code:
  ```bash
  pnpm lint
  ```

- Format code:
  ```bash
  pnpm format
  ```

### Local Development

1. Make changes to source code
2. Build the packages:
   ```bash
   pnpm build
   ```
3. Test your changes:
   ```bash
   pnpm test
   ```

## Testing

Run the test suite with:

```bash
pnpm test
```

## Adding Dependencies

- Add a dependency to a specific package:
  ```bash
  pnpm --filter @no-more-standups/core add <package-name>
  ```

- Add a development dependency to the root:
  ```bash
  pnpm add -D <package-name>
  ```

## Troubleshooting

If you encounter linting errors in generated files:

```bash
pnpm format
```

If you get errors about unknown file extensions with .ts files, use:

```bash
# From the root directory
pnpm cli:dev
```

This command will properly execute the CLI in development mode.

## License

This project is licensed under the ISC License. 