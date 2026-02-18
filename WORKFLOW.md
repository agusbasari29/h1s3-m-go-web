# WORKFLOW - Frontend Development

## Overview

This document describes the workflow for developing the Next.js frontend using autonomous agents.

## Roles

| Role | Responsibility |
|------|----------------|
| **Planner** | Analyze requirements, break down tasks |
| **Builder** | Implement features, components, pages |
| **Tester** | Verify implementation, run tests |
| **Reviewer** | Code review, quality check |
| **Coordinator** | Orchestrate tasks, manage handoffs |

## Workflow

```
Planner → Builder → Tester → Reviewer → (Merge)
                   ↑          |
                   └──────────┘ (if needs fix)
```

## Task Lifecycle

### 1. Planner Creates Issue
- Break down feature into tasks
- Add acceptance criteria
- Set dependencies

### 2. Builder Implements
- Create branch: `feature/{issue-id}-{description}`
- Implement code
- Write unit tests
- Run linter and formatter

### 3. Tester Validates
- Checkout branch
- Run tests: `npm test`
- Verify implementation
- Report results

### 4. Reviewer Approves
- Code review
- Check for issues
- Post approval or request changes

### 5. Coordinator Merges
- Update tracking
- Assign next task
- Close issue

## Branch Naming

```
feature/{issue-id}-{description}   # New features
bugfix/{issue-id}-{description}    # Bug fixes
hotfix/{issue-id}-{description}    # Urgent fixes
docs/{issue-id}-{description}      # Documentation
```

## Commit Message Format

```
{type}: {short description}

{body (optional)}

Closes #{issue_id}
```

Types: feat, fix, docs, style, refactor, test, chore

## Pull Request Template

```markdown
## Summary
- {description}

## Changes
- {file}: {change}

## Test Results
- npm test: PASS/FAIL
- npm run lint: PASS/FAIL

## Screenshots (if UI)
```

## Issue Labels

- `frontend` - Frontend work
- `component` - New component
- `api-integration` - Backend API integration
- `bug` - Bug fix
- `design` - UI/UX work

## Quick Commands

```bash
# Development
npm run dev

# Testing
npm test
npm test:coverage

# Linting
npm run lint
npm run format
```
