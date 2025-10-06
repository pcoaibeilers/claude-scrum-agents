/**
 * Git Helper - Git operations for development workflow
 */

const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

class GitHelper {
  constructor(workingDir = process.cwd()) {
    this.git = simpleGit(workingDir);
    this.workingDir = workingDir;
  }

  /**
   * Check if current directory is a git repository
   */
  async isGitRepo() {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize git repository if not exists
   */
  async init() {
    const isRepo = await this.isGitRepo();
    if (!isRepo) {
      await this.git.init();
      return { initialized: true };
    }
    return { initialized: false, message: 'Already a git repository' };
  }

  /**
   * Get current git status
   */
  async status() {
    return await this.git.status();
  }

  /**
   * Get diff of changes
   */
  async diff(options = {}) {
    const { staged = false, file = null } = options;

    if (file) {
      return staged
        ? await this.git.diff(['--cached', file])
        : await this.git.diff([file]);
    }

    return staged
      ? await this.git.diff(['--cached'])
      : await this.git.diff();
  }

  /**
   * Stage files
   */
  async add(files = '.') {
    if (Array.isArray(files)) {
      await this.git.add(files);
    } else {
      await this.git.add(files);
    }
    return { staged: true };
  }

  /**
   * Commit changes
   */
  async commit(message, options = {}) {
    const { author = null } = options;

    const commitOptions = {};
    if (author) {
      commitOptions['--author'] = author;
    }

    const result = await this.git.commit(message, commitOptions);
    return {
      success: true,
      commit: result.commit,
      summary: result.summary
    };
  }

  /**
   * Create and switch to new branch
   */
  async createBranch(branchName, options = {}) {
    const { switchTo = true } = options;

    if (switchTo) {
      await this.git.checkoutLocalBranch(branchName);
    } else {
      await this.git.branch([branchName]);
    }

    return { branch: branchName, switched: switchTo };
  }

  /**
   * Switch to existing branch
   */
  async checkout(branchName) {
    await this.git.checkout(branchName);
    return { branch: branchName };
  }

  /**
   * Get current branch
   */
  async getCurrentBranch() {
    const status = await this.git.status();
    return status.current;
  }

  /**
   * List branches
   */
  async listBranches() {
    const result = await this.git.branch();
    return {
      all: result.all,
      current: result.current,
      branches: result.branches
    };
  }

  /**
   * Push to remote
   */
  async push(options = {}) {
    const { remote = 'origin', branch = null, setUpstream = false } = options;

    const currentBranch = branch || await this.getCurrentBranch();

    if (setUpstream) {
      await this.git.push(['-u', remote, currentBranch]);
    } else {
      await this.git.push(remote, currentBranch);
    }

    return { pushed: true, remote, branch: currentBranch };
  }

  /**
   * Pull from remote
   */
  async pull(options = {}) {
    const { remote = 'origin', branch = null } = options;

    if (branch) {
      await this.git.pull(remote, branch);
    } else {
      await this.git.pull();
    }

    return { pulled: true };
  }

  /**
   * Get commit log
   */
  async log(options = {}) {
    const { maxCount = 10 } = options;

    const log = await this.git.log({ maxCount });
    return log.all;
  }

  /**
   * Detect tech stack from repository
   */
  async detectTechStack() {
    const techStack = [];

    try {
      // Check for package.json (Node.js)
      const packageJsonPath = path.join(this.workingDir, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        techStack.push('node');

        // Check dependencies for specific frameworks
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (deps.react) techStack.push('react');
        if (deps.vue) techStack.push('vue');
        if (deps.express) techStack.push('express');
        if (deps.typescript) techStack.push('typescript');
        if (deps.jest) techStack.push('jest');
      } catch {}

      // Check for requirements.txt (Python)
      try {
        await fs.access(path.join(this.workingDir, 'requirements.txt'));
        techStack.push('python');
      } catch {}

      // Check for pom.xml (Java/Maven)
      try {
        await fs.access(path.join(this.workingDir, 'pom.xml'));
        techStack.push('java', 'maven');
      } catch {}

      // Check for Cargo.toml (Rust)
      try {
        await fs.access(path.join(this.workingDir, 'Cargo.toml'));
        techStack.push('rust');
      } catch {}

      // Check for go.mod (Go)
      try {
        await fs.access(path.join(this.workingDir, 'go.mod'));
        techStack.push('go');
      } catch {}

    } catch (error) {
      // Return empty if detection fails
    }

    return techStack;
  }

  /**
   * Get repository information
   */
  async getRepoInfo() {
    const isRepo = await this.isGitRepo();
    if (!isRepo) {
      return { isGitRepo: false };
    }

    const status = await this.status();
    const currentBranch = await this.getCurrentBranch();
    const techStack = await this.detectTechStack();

    return {
      isGitRepo: true,
      currentBranch,
      modified: status.modified.length,
      created: status.created.length,
      deleted: status.deleted.length,
      staged: status.staged.length,
      techStack
    };
  }
}

module.exports = GitHelper;
