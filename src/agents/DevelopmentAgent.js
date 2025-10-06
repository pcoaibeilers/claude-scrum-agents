/**
 * Development Agent - AI-powered code generation and development tasks
 */

const ClaudeClient = require('../utils/claude-client');
const GitHelper = require('../utils/git-helper');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

class DevelopmentAgent {
  constructor(config = {}) {
    this.workingDir = config.workingDir || process.cwd();
    this.claude = new ClaudeClient(config.claude || {});
    this.git = new GitHelper(this.workingDir);
  }

  /**
   * Generate code from user story
   */
  async generateFromStory(story, options = {}) {
    console.log(chalk.blue('🤖 Development Agent - Code Generation\n'));
    console.log(chalk.white(`Story: ${story.title}\n`));

    // Get repository context
    const repoInfo = await this.git.getRepoInfo();
    const techStack = options.techStack || repoInfo.techStack || ['node'];

    console.log(chalk.gray('Analyzing requirements...'));

    // Generate code using Claude
    const generatedCode = await this.claude.generateCode(story, {
      techStack,
      testFramework: options.testFramework || 'jest',
      outputPath: options.outputPath || ''
    });

    console.log(chalk.green('✓ Code generated\n'));

    // Parse generated code into files
    const files = this.parseGeneratedCode(generatedCode);

    console.log(chalk.white('Generated files:'));
    files.forEach(file => {
      console.log(chalk.green(`  ✓ ${file.path} (${file.lines} lines)`));
    });

    // Write files if requested
    if (options.write) {
      await this.writeGeneratedFiles(files, options.outputPath);
      console.log(chalk.green('\n✓ Files written to disk'));
    }

    return {
      success: true,
      files,
      rawOutput: generatedCode
    };
  }

  /**
   * Generate tests for existing file
   */
  async generateTests(filePath, options = {}) {
    console.log(chalk.blue('🧪 Development Agent - Test Generation\n'));
    console.log(chalk.white(`File: ${filePath}\n`));

    // Read source file
    const fullPath = path.join(this.workingDir, filePath);
    const code = await fs.readFile(fullPath, 'utf-8');

    console.log(chalk.gray('Analyzing code...'));

    // Generate tests
    const tests = await this.claude.generateTests(code, {
      framework: options.framework || 'jest',
      coverageTarget: options.coverage || 80
    });

    console.log(chalk.green('✓ Tests generated\n'));

    // Determine test file path
    const testPath = this.getTestFilePath(filePath, options.framework);

    console.log(chalk.white(`Test file: ${testPath}`));

    // Write test file if requested
    if (options.write) {
      const testFullPath = path.join(this.workingDir, testPath);
      await fs.mkdir(path.dirname(testFullPath), { recursive: true });
      await fs.writeFile(testFullPath, tests);
      console.log(chalk.green('✓ Test file written'));
    }

    return {
      success: true,
      testPath,
      tests
    };
  }

  /**
   * Review code
   */
  async reviewCode(filePath, options = {}) {
    console.log(chalk.blue('👀 Development Agent - Code Review\n'));
    console.log(chalk.white(`File: ${filePath}\n`));

    // Read source file
    const fullPath = path.join(this.workingDir, filePath);
    const code = await fs.readFile(fullPath, 'utf-8');

    console.log(chalk.gray('Analyzing code quality...'));

    // Get review from Claude
    const review = await this.claude.reviewCode(code);

    console.log(chalk.green('✓ Review complete\n'));
    console.log(chalk.white(review));

    return {
      success: true,
      review
    };
  }

  /**
   * Refactor code
   */
  async refactorCode(filePath, instructions, options = {}) {
    console.log(chalk.blue('♻️  Development Agent - Code Refactoring\n'));
    console.log(chalk.white(`File: ${filePath}`));
    console.log(chalk.white(`Instructions: ${instructions}\n`));

    // Read source file
    const fullPath = path.join(this.workingDir, filePath);
    const code = await fs.readFile(fullPath, 'utf-8');

    console.log(chalk.gray('Refactoring code...'));

    // Get refactored code
    const refactored = await this.claude.refactorCode(code, instructions);

    console.log(chalk.green('✓ Refactoring complete\n'));

    // Write refactored code if requested
    if (options.write) {
      await fs.writeFile(fullPath, refactored);
      console.log(chalk.green('✓ File updated'));
    }

    return {
      success: true,
      refactored
    };
  }

  /**
   * Create git commit with AI-generated message
   */
  async createCommit(options = {}) {
    console.log(chalk.blue('📝 Development Agent - Creating Commit\n'));

    // Check if there are changes
    const status = await this.git.status();
    if (status.files.length === 0) {
      console.log(chalk.yellow('⚠ No changes to commit'));
      return { success: false, message: 'No changes' };
    }

    // Stage files
    if (options.files) {
      await this.git.add(options.files);
    } else {
      await this.git.add('.');
    }

    // Get diff
    const diff = await this.git.diff({ staged: true });

    console.log(chalk.gray('Analyzing changes...'));

    // Generate commit message
    let message;
    if (options.message) {
      message = options.message;
    } else {
      message = await this.claude.generateCommitMessage(diff, {
        convention: options.convention || 'conventional'
      });
    }

    console.log(chalk.white(`Commit message: ${message}\n`));

    // Create commit
    const result = await this.git.commit(message);

    console.log(chalk.green(`✓ Committed: ${result.commit}`));

    return {
      success: true,
      commit: result.commit,
      message
    };
  }

  /**
   * Helper: Parse generated code into file objects
   */
  parseGeneratedCode(generatedCode) {
    const files = [];
    const fileRegex = /```(?:javascript|typescript|js|ts)\n\/\/ Filename: (.+?)\n([\s\S]+?)```/g;

    let match;
    while ((match = fileRegex.exec(generatedCode)) !== null) {
      const [, filePath, code] = match;
      files.push({
        path: filePath.trim(),
        code: code.trim(),
        lines: code.trim().split('\n').length
      });
    }

    // Fallback: if no filenames found, create single file
    if (files.length === 0) {
      const codeMatch = generatedCode.match(/```(?:javascript|typescript|js|ts)\n([\s\S]+?)```/);
      if (codeMatch) {
        files.push({
          path: 'generated.js',
          code: codeMatch[1].trim(),
          lines: codeMatch[1].trim().split('\n').length
        });
      }
    }

    return files;
  }

  /**
   * Helper: Write generated files to disk
   */
  async writeGeneratedFiles(files, outputPath = '') {
    for (const file of files) {
      const fullPath = path.join(this.workingDir, outputPath, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.code);
    }
  }

  /**
   * Helper: Get test file path for a source file
   */
  getTestFilePath(sourcePath, framework = 'jest') {
    const parsed = path.parse(sourcePath);
    const testDir = path.join(parsed.dir, '__tests__');
    const testFile = `${parsed.name}.test${parsed.ext}`;
    return path.join(testDir, testFile);
  }
}

module.exports = DevelopmentAgent;
