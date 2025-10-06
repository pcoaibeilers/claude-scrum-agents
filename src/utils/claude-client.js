/**
 * Claude Code Client - Wrapper for Anthropic API
 */

const Anthropic = require('@anthropic-ai/sdk');

class ClaudeClient {
  constructor(config = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not found. Set it in environment or pass via config.');
    }

    this.client = new Anthropic({ apiKey });
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.maxTokens = config.maxTokens || 4000;
  }

  /**
   * Send a prompt to Claude and get response
   */
  async ask(prompt, options = {}) {
    try {
      const response = await this.client.messages.create({
        model: options.model || this.model,
        max_tokens: options.maxTokens || this.maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  /**
   * Generate code from user story
   */
  async generateCode(story, options = {}) {
    const { techStack = [], testFramework = 'jest', outputPath = '' } = options;

    const prompt = `As an expert software developer, generate production-ready code for this user story:

Story: ${story.title}
Description: ${story.description || ''}
Acceptance Criteria:
${(story.acceptanceCriteria || []).map((ac, i) => `${i + 1}. ${ac}`).join('\n')}

Tech Stack: ${techStack.join(', ') || 'Node.js'}
Test Framework: ${testFramework}
${outputPath ? `Output Path: ${outputPath}` : ''}

Generate:
1. Complete implementation with proper error handling
2. Unit tests with good coverage
3. JSDoc comments for all functions
4. README section explaining the code

Format the response as:
\`\`\`javascript
// Filename: <filename>
<code>
\`\`\`

Include all necessary files.`;

    return await this.ask(prompt, { maxTokens: 4000 });
  }

  /**
   * Generate tests for existing code
   */
  async generateTests(code, options = {}) {
    const { framework = 'jest', coverageTarget = 80 } = options;

    const prompt = `As a QA engineer, generate comprehensive tests for this code:

${code}

Test Framework: ${framework}
Coverage Target: ${coverageTarget}%

Generate:
1. Unit tests covering all functions
2. Edge cases and error scenarios
3. Mock strategies for dependencies
4. Integration tests if applicable

Format as complete test file with proper imports and describe blocks.`;

    return await this.ask(prompt, { maxTokens: 3000 });
  }

  /**
   * Review code and suggest improvements
   */
  async reviewCode(code, options = {}) {
    const prompt = `As a senior developer, review this code and provide feedback:

${code}

Focus on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance optimizations
4. Security concerns
5. Maintainability

Provide specific, actionable suggestions.`;

    return await this.ask(prompt, { maxTokens: 2500 });
  }

  /**
   * Refactor code based on instructions
   */
  async refactorCode(code, instructions) {
    const prompt = `Refactor this code according to these instructions:

Code:
${code}

Instructions: ${instructions}

Provide the refactored code with explanations of changes made.`;

    return await this.ask(prompt, { maxTokens: 3000 });
  }

  /**
   * Generate commit message from changes
   */
  async generateCommitMessage(diff, options = {}) {
    const { convention = 'conventional' } = options;

    const prompt = `Generate a commit message for these changes:

${diff}

Format: ${convention === 'conventional' ? 'Conventional Commits (type: description)' : 'Standard format'}

Keep it concise but descriptive.`;

    return await this.ask(prompt, { maxTokens: 500 });
  }
}

module.exports = ClaudeClient;
