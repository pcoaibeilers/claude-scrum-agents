# Claude Scrum Agents - Standalone CLI Package

## 🎯 Project Goal
Universal, project-independent CLI tools for AI-powered development workflow using Claude Code API.

---

## 📦 Package Structure

```
claude-scrum-agents/
├── package.json                    # NPM package config
├── .env.example                    # Environment template
├── README.md                       # Usage documentation
├── bin/                            # CLI executables
│   ├── dev-agent                   # Development Agent CLI
│   ├── po-agent                    # Product Owner CLI
│   ├── qa-agent                    # QA Agent CLI
│   ├── arch-agent                  # Architect CLI
│   ├── sm-agent                    # Scrum Master CLI
│   └── devops-agent                # DevOps CLI
├── src/
│   ├── agents/                     # Agent implementations
│   │   ├── DevelopmentAgent.js
│   │   ├── ProductOwnerAgent.js
│   │   ├── QAAgent.js
│   │   ├── ArchitectAgent.js
│   │   ├── ScrumMasterAgent.js
│   │   └── DevOpsAgent.js
│   └── utils/                      # Shared utilities
│       ├── claude-client.js        # Claude API wrapper
│       ├── git-helper.js           # Git operations
│       ├── file-helper.js          # File I/O
│       └── logger.js               # Console logging
└── examples/                       # Usage examples
    └── workflow-example.md
```

---

## 🚀 Installation & Setup

### Global Installation
```bash
npm install -g claude-scrum-agents
```

### Configuration
```bash
# Set API key
export ANTHROPIC_API_KEY=your_key_here

# Or create .env file in project root
echo "ANTHROPIC_API_KEY=your_key" > .env
```

---

## 💻 CLI Commands

### Development Agent (`dev-agent`)
```bash
# Generate code from user story
dev-agent generate --story "User login with email"

# Implement specific feature
dev-agent implement --file src/auth.js --description "Add JWT validation"

# Generate tests for file
dev-agent test --file src/auth.js

# Code review
dev-agent review --file src/auth.js

# Refactor code
dev-agent refactor --file src/legacy.js --pattern "modern ES6"

# Git workflow
dev-agent commit --message "feat: add user authentication"
dev-agent pr create --title "User Auth Feature"
```

### Product Owner Agent (`po-agent`)
```bash
# Create user story
po-agent story create --title "User Dashboard" --description "..."

# Refine story with INVEST criteria
po-agent story refine --id STORY-123

# Prioritize backlog
po-agent backlog prioritize --criteria business-value

# Define sprint goal
po-agent sprint goal --sprint 5 --items "STORY-1,STORY-2"

# Validate deliverable
po-agent validate --story STORY-123 --pr 456
```

### QA Agent (`qa-agent`)
```bash
# Generate test plan
qa-agent plan --story STORY-123

# Generate test suite
qa-agent tests generate --file src/auth.js

# Run coverage analysis
qa-agent coverage --threshold 80

# Security audit
qa-agent security scan

# Performance tests
qa-agent perf --endpoint /api/users
```

### Architect Agent (`arch-agent`)
```bash
# Review architecture
arch-agent review --codebase .

# Generate architecture diagram
arch-agent diagram --output architecture.mermaid

# Suggest design patterns
arch-agent patterns --for "user authentication"

# Analyze scalability
arch-agent scale analyze --component api-server

# Technology recommendations
arch-agent tech recommend --requirements requirements.md
```

### Scrum Master Agent (`sm-agent`)
```bash
# Create hyper-detailed story
sm-agent story enrich --id STORY-123

# Sprint analysis
sm-agent sprint analyze --number 5

# Velocity prediction
sm-agent velocity predict --historical last-5-sprints

# Retrospective insights
sm-agent retro analyze --sprint 5
```

### DevOps Agent (`devops-agent`)
```bash
# Generate CI/CD pipeline
devops-agent pipeline create --platform github-actions

# Generate Terraform
devops-agent terraform --provider azure

# Generate Dockerfile
devops-agent docker create --tech-stack node,postgres

# Setup monitoring
devops-agent monitor setup --service api-server

# Security scan
devops-agent security scan --dockerfile Dockerfile
```

---

##  🔧 Implementation Priority

### Phase 1: Core Infrastructure
1. ✅ Package structure
2. ✅ package.json with CLI binaries
3. ✅ Claude client wrapper
4. ✅ Git helper utilities
5. ✅ Logger utility

### Phase 2: Essential Agents
1. **Development Agent** (HIGHEST PRIORITY)
   - Code generation
   - Test generation
   - Git integration

2. **Product Owner Agent**
   - Story creation/refinement
   - Backlog management

3. **QA Agent**
   - Test generation
   - Coverage analysis

### Phase 3: Advanced Agents
4. **Architect Agent**
5. **Scrum Master Agent**
6. **DevOps Agent**

---

## 📝 Example Workflow

```bash
# In any project directory

# 1. PO creates story
po-agent story create --title "User Authentication" \
  --description "Users should be able to login with email/password"

# 2. SM enriches story
sm-agent story enrich --id STORY-001

# 3. Architect reviews approach
arch-agent patterns --for "authentication"

# 4. Developer implements
dev-agent generate --story STORY-001 --output src/auth/

# 5. Developer creates tests
dev-agent test --file src/auth/login.js

# 6. QA validates
qa-agent coverage --file src/auth/

# 7. DevOps prepares deployment
devops-agent pipeline create

# 8. Create PR
dev-agent pr create --title "feat: User Authentication"

# 9. PO validates
po-agent validate --story STORY-001 --pr 123
```

---

## 🎨 Key Features

### Universal & Portable
- ✅ Works in ANY project directory
- ✅ No Azure/Cloud dependencies
- ✅ Local Git integration
- ✅ Project-agnostic

### Smart & Context-Aware
- ✅ Analyzes current project structure
- ✅ Detects tech stack automatically
- ✅ Adapts to project conventions
- ✅ Learns from existing code

### Developer-Friendly
- ✅ Simple CLI commands
- ✅ Interactive prompts when needed
- ✅ Colorful, readable output
- ✅ Helpful error messages

---

## 🔐 Configuration

### .env Example
```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4000
GIT_AUTHOR_NAME=Claude Agent
GIT_AUTHOR_EMAIL=agent@claude.ai
LOG_LEVEL=info
```

### Project-specific Config
Create `.claude-agents.json` in project root:
```json
{
  "techStack": ["node", "typescript", "react"],
  "conventions": {
    "commitMessage": "conventional",
    "branchNaming": "feature/STORY-{id}",
    "testFramework": "jest"
  },
  "defaults": {
    "testCoverage": 80,
    "codeReview": true
  }
}
```

---

## 📊 Output Examples

### dev-agent generate
```
🤖 Development Agent - Code Generation

Story: User Authentication (STORY-001)

Analyzing requirements...
✓ Requirements analyzed
✓ Tech stack detected: Node.js, Express
✓ Generating code...

Generated files:
  ✓ src/auth/login.js (124 lines)
  ✓ src/auth/middleware.js (45 lines)
  ✓ src/auth/__tests__/login.test.js (89 lines)

Summary:
  Files: 3
  Lines of code: 258
  Tests included: Yes
  Coverage: ~85%

Next steps:
  1. Review generated code
  2. Run: npm test
  3. Commit: dev-agent commit -m "feat: user authentication"
```

---

## 🚢 Next Steps

1. ✅ Review this plan
2. Create package.json
3. Implement claude-client.js
4. Implement DevelopmentAgent (priority!)
5. Create dev-agent CLI
6. Test in real project
7. Iterate based on feedback

---

## ❓ Questions to Decide

1. Should agents store state locally (e.g., `.claude-agents/` folder)?
2. Support for multiple AI providers (OpenAI, local models)?
3. Web UI for non-CLI users?
4. Integration with Jira/Linear/GitHub Issues?

**Ready to implement? Which agent should I start with?**
- Development Agent (recommended)
- Product Owner Agent
- QA Agent
- All in minimal version
