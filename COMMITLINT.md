# Husky & Commitlint Setup

This document describes how commit standards are enforced in the Sentinel project using Husky and Commitlint.

## Overview

The project uses:

- **Husky**: Git hooks framework
- **Commitlint**: Validates commit messages against conventional commits standard
- **Lint-staged**: Runs linters on staged files before commit

## Installation

After cloning the repository, run:

```bash
npm install
```

This will:

1. Install all dependencies (including Husky, Commitlint, lint-staged)
2. Run `npm run prepare` which initializes Husky hooks

## Git Hooks

### Pre-commit Hook

**File**: `.husky/pre-commit`

Runs before a commit is created. Performs:

- Linting on staged files
- Code formatting with Prettier
- JSON and Markdown formatting

Staged files are modified in-place and re-staged if changes are made.

**Triggers when**: Attempting to commit

**Can bypass with**: `git commit --no-verify` (⚠️ Not recommended)

### Commit-msg Hook

**File**: `.husky/commit-msg`

Validates the commit message against conventional commits standard.

**Triggers when**: After you've written a commit message

**Rules enforced**:

- Type must be one of: feat, fix, docs, style, refactor, perf, test, ci, chore, revert
- Type must be lowercase
- Scope (if present) must be lowercase
- Subject is required and must be lowercase
- Subject must not end with a period
- Header must be ≤ 100 characters

## Commitlint Rules

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

**Required**. Describes the kind of change:

| Type       | Purpose                                              |
| ---------- | ---------------------------------------------------- |
| `feat`     | A new feature                                        |
| `fix`      | A bug fix                                            |
| `docs`     | Documentation changes only                           |
| `style`    | Formatting, missing semicolons, etc (no code change) |
| `refactor` | Code change that neither fixes nor adds feature      |
| `perf`     | Code change that improves performance                |
| `test`     | Adding or updating tests                             |
| `ci`       | CI/CD configuration changes                          |
| `chore`    | Other changes (deps, build scripts, etc)             |
| `revert`   | Revert a previous commit                             |

### Scope

Optional. Specifies what part of the codebase is affected:

Examples: `api`, `auth`, `database`, `docker`, `ci`, `types`

```bash
git commit -m "feat(monitoring): add real-time alert detection"
git commit -m "fix(webhook): handle retry logic for failed sends"
```

### Subject

**Required**. Brief summary (≤ 50 characters recommended, ≤ 100 characters hard limit):

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- Don't end with period

### Body

Optional. Detailed explanation of the change:

- Wrap at 72 characters
- Explain what and why, not how
- Use blank line to separate from subject

### Footer

Optional. Reference issues and breaking changes:

```
Fixes #123
Closes #456
BREAKING CHANGE: description
```

## Examples

### Good Commits

```bash
# Simple fix
git commit -m "fix: prevent race condition in alert detection"

# Feature with scope
git commit -m "feat(discord): add rich embed support for alerts"

# With body
git commit -m "feat(monitoring): add Stellar network support

Add support for monitoring Stellar Soroban contracts
for malicious function signatures in mempool."

# Fixing an issue
git commit -m "fix(webhook): handle timeout on failed delivery

Closes #42"
```

### Bad Commits (Will be Rejected)

```bash
# ✗ No type
git commit -m "update dependencies"

# ✗ Type not lowercase
git commit -m "Feat: add new feature"

# ✗ Subject starts with capital
git commit -m "feat: Add new feature"

# ✗ Subject ends with period
git commit -m "feat: add new feature."

# ✗ Subject too long (> 100 chars)
git commit -m "feat: add comprehensive support for all blockchain networks with full monitoring and detection"

# ✗ Invalid type
git commit -m "feature: add new feature"
```

## Configuration

### Configuration Files

- `.commitlintrc.js` - Commitlint rules and settings
- `.husky/pre-commit` - Pre-commit hook script
- `.husky/commit-msg` - Commit-msg hook script
- `package.json` - Dependencies and lint-staged config

### Lint-staged Configuration

Defined in `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

This runs:

- ESLint with auto-fix on TypeScript files
- Prettier on all staged files
- Prettier on JSON and Markdown files

## Bypassing Hooks

### Skip pre-commit hook

```bash
git commit --no-verify
```

Or using short flag:

```bash
git commit -n
```

### Skip commit-msg hook

```bash
git commit --no-verify
```

⚠️ **Warning**: Bypassing hooks is not recommended as it defeats the purpose of enforcing standards.

## Troubleshooting

### Hooks not running

**Problem**: Husky hooks are not executing

**Solution**:

```bash
# Reinstall Husky
npm run prepare

# Or manually:
npx husky install
```

### "Husky can't find .git directory"

**Problem**: Working in a subdirectory

**Solution**: Install with custom directory:

```bash
npx husky install ../.husky
```

### Commit message rejected

**Problem**: Commitlint rejected your message

**Solution**: Follow the format: `<type>(<scope>): <subject>`

```bash
# ✗ Invalid
git commit -m "update stuff"

# ✓ Valid
git commit -m "fix: resolve race condition in monitoring"
```

### Prettier/ESLint failing

**Problem**: Pre-commit hook fails due to formatting or linting

**Solution**: Run linting and formatting manually:

```bash
npm run lint:fix
npm run format
```

Then retry your commit.

### Hooks not executable on Windows

**Problem**: "command not found" or "permission denied"

**Solution**: Husky handles this automatically, but if issues persist:

```bash
npm run prepare
```

## Development Workflow

### Making a commit

1. **Stage your changes**:

   ```bash
   git add .
   ```

2. **Commit with proper message**:

   ```bash
   git commit -m "feat(alerts): add severity levels"
   ```

3. **Pre-commit hook runs**:
   - ✓ Linting passes
   - ✓ Formatting applied
   - ✓ Files re-staged

4. **Commit-msg hook runs**:
   - ✓ Message format valid
   - ✓ Commit created

5. **If hooks fail**:
   - Fix the issues
   - Stage changes: `git add .`
   - Retry commit: `git commit --amend --no-edit`

### Pushing to remote

```bash
git push origin feature-branch
```

The CI pipeline will run additional checks.

## CI/CD Integration

The `.github/workflows/ci.yml` includes:

- Linting checks
- Formatting validation
- Build verification

Commits that pass local hooks should pass CI, but CI is a final safety net.

## Best Practices

1. **Use atomic commits**: Each commit should be a single logical change
2. **Write meaningful messages**: Help future developers understand why
3. **Reference issues**: Use "Fixes #123" or "Closes #456" in footer
4. **Scope properly**: Use scopes to clarify affected areas
5. **Keep subjects short**: ≤ 50 characters is ideal
6. **Use imperative mood**: "add feature" not "added feature"

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Semantic Versioning](https://semver.org/)

## Commit Message Generator

If you need help formatting messages, use the interactive generator:

```bash
# Using commitizen (optional, not installed by default)
npm install -g commitizen
cz commit
```

Or follow the format manually:

```
<type>(<scope>): <subject>
<blank line>
<body>
<blank line>
<footer>
```

## Disabling Hooks (Not Recommended)

To temporarily disable hooks:

```bash
# Disable pre-commit hook
mv .husky/pre-commit .husky/pre-commit.bak
git commit -m "fix: urgent hotfix"
mv .husky/pre-commit.bak .husky/pre-commit
```

However, **this is not recommended** as it breaks consistency. Instead, follow the standards or discuss exceptions with the team.

## Supporting Different Environments

Husky works on:

- ✓ macOS
- ✓ Linux
- ✓ Windows (Git Bash, WSL)
- ✓ Docker containers
- ✗ GitHub Actions (hooks don't run on remote)

## Frequently Asked Questions

### Q: Do hooks run in CI/CD?

**A**: No. Hooks only run locally. CI/CD uses separate checks.

### Q: Can I use different commit format?

**A**: No. This project enforces conventional commits for consistency.

### Q: What if I make a mistake in my message?

**A**: Amend your commit:

```bash
git commit --amend
```

### Q: How do I revert a commit?

**A**: Use the revert type:

```bash
git commit -m "revert: undo previous feature addition"
```

### Q: Are commit messages case-sensitive?

**A**: Yes. Types must be lowercase (feat, not Feat or FEAT).

## Updating Dependencies

To update Husky or Commitlint:

```bash
npm update @commitlint/cli @commitlint/config-conventional husky lint-staged
npm run prepare
```

Then commit the changes:

```bash
git add package.json package-lock.json
git commit -m "chore: update git hooks dependencies"
```

## Feedback & Issues

For issues with commit validation:

1. Check this documentation
2. Review `.commitlintrc.js` configuration
3. Run: `npx commitlint --print-config` to see active rules
4. Open an issue on GitHub
