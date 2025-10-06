# Claude Scrum Agents - Development Agent (MVP)

Standalone CLI tool for AI-powered development workflow using Claude Code API.

## Features

- **Code Generation** - Generate production-ready code from user stories
- **Test Generation** - Automatically create unit tests for existing code
- **Code Review** - AI-powered code review and suggestions
- **Refactoring** - Refactor code based on instructions
- **Smart Commits** - Create git commits with AI-generated messages

## Installation

### Local Installation

```bash
cd claude-scrum-agents
npm install
npm link  # Creates global dev-agent command
```

### Configuration

Set your Anthropic API key:

```bash
export ANTHROPIC_API_KEY=your_key_here

# OR create .env file
cp .env.example .env
# Edit .env and add your API key
```

## Usage

### Generate Code from User Story

```bash
dev-agent generate \
  --title "User Authentication" \
  --description "Users should be able to login with email and password" \
  --acceptance "User can login with valid credentials" \
  --acceptance "Invalid credentials show error message" \
  --tech-stack node express \
  --write
```

**Options:**
- `-t, --title <title>` - Story title (required)
- `-d, --description <desc>` - Story description
- `-a, --acceptance <criteria>` - Acceptance criteria (repeatable)
- `-o, --output <path>` - Output directory
- `--tech-stack <stack...>` - Technology stack (e.g., node, react, typescript)
- `--test-framework <framework>` - Test framework (default: jest)
- `--write` - Write generated files to disk

### Generate Tests

```bash
dev-agent test src/auth.js --write

# With options
dev-agent test src/auth.js \
  --framework jest \
  --coverage 85 \
  --write
```

**Options:**
- `-f, --framework <framework>` - Test framework (default: jest)
- `-c, --coverage <target>` - Coverage target percentage (default: 80)
- `--write` - Write test file to disk

### Review Code

```bash
dev-agent review src/auth.js
```

### Refactor Code

```bash
dev-agent refactor src/legacy.js "Convert to modern ES6 syntax" --write

# Another example
dev-agent refactor src/utils.js "Extract duplicate logic into helper functions" --write
```

**Options:**
- `--write` - Write refactored code to disk

### Create Git Commit

```bash
# Auto-generate commit message from staged changes
dev-agent commit

# With custom message
dev-agent commit -m "feat: add user authentication"

# Commit specific files
dev-agent commit --files src/auth.js src/middleware.js

# Use specific commit convention
dev-agent commit --convention conventional
```

**Options:**
- `-m, --message <message>` - Custom commit message (overrides AI)
- `-f, --files <files...>` - Specific files to commit
- `--convention <type>` - Commit convention (default: conventional)

## Examples

### Complete Workflow Example

```bash
# 1. Generate code for a feature
dev-agent generate \
  --title "Password Reset" \
  --description "Users can reset their password via email" \
  --acceptance "User receives reset email" \
  --acceptance "Link expires after 1 hour" \
  --tech-stack node express \
  --output src/auth \
  --write

# 2. Generate tests
dev-agent test src/auth/password-reset.js --write

# 3. Review the code
dev-agent review src/auth/password-reset.js

# 4. Commit changes
dev-agent commit
```

### Quick Test Generation

```bash
# Generate tests for all files in a directory
for file in src/*.js; do
  dev-agent test "$file" --write
done
```

## Project Detection

The Development Agent automatically detects your project's tech stack by analyzing:
- `package.json` (Node.js, React, Vue, Express, TypeScript, Jest)
- `requirements.txt` (Python)
- `pom.xml` (Java/Maven)
- `Cargo.toml` (Rust)
- `go.mod` (Go)

This ensures generated code matches your project conventions.

## Output Examples

### Code Generation Output

```
🤖 Development Agent - Code Generation

Story: User Authentication

Analyzing requirements...
✓ Code generated

Generated files:
  ✓ src/auth/login.js (124 lines)
  ✓ src/auth/middleware.js (45 lines)
  ✓ src/auth/__tests__/login.test.js (89 lines)

✓ Files written to disk
```

### Test Generation Output

```
🧪 Development Agent - Test Generation

File: src/auth.js

Analyzing code...
✓ Tests generated

Test file: src/__tests__/auth.test.js
✓ Test file written
```

## Requirements

- Node.js 18+
- Anthropic API key
- Git (for commit functionality)

## Architecture

```
claude-scrum-agents/
├── bin/
│   └── dev-agent           # CLI executable
├── src/
│   ├── agents/
│   │   └── DevelopmentAgent.js
│   └── utils/
│       ├── claude-client.js    # Claude API wrapper
│       └── git-helper.js       # Git operations
├── package.json
└── README.md
```

## Future Agents (Coming Soon)

- `po-agent` - Product Owner Agent (story creation, backlog management)
- `qa-agent` - QA Agent (test planning, coverage analysis)
- `arch-agent` - Architect Agent (architecture review, diagrams)
- `sm-agent` - Scrum Master Agent (sprint analysis, velocity prediction)
- `devops-agent` - DevOps Agent (CI/CD, infrastructure, monitoring)

## Troubleshooting

### "ANTHROPIC_API_KEY not found"

Make sure you've set the API key:
```bash
export ANTHROPIC_API_KEY=your_key_here
```

Or create a `.env` file with:
```
ANTHROPIC_API_KEY=your_key_here
```

### "Command not found: dev-agent"

Run `npm link` in the project directory to create the global command.

### Generated files not appearing

Make sure to use the `--write` flag to save files to disk. Without it, output is printed to console only.

## License

MIT
