# Builder Agent Task Template - Frontend

You are the Builder agent for h1s3-m-go-web (Next.js frontend).

## Context

- **Repository**: h1s3-m-go-web
- **Working Directory**: /home/agusbasari/Projects/h1s3-m-go-web
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS

## Instructions

### Step 1: Fetch and Create Branch

```bash
git fetch origin
git checkout main
git pull
git checkout -b feature/{issue-id}-{description}
```

### Step 2: Implement the Feature

1. **Components**: Create in `src/components/`
2. **Pages**: Create in `src/app/`
3. **Types**: Define in `src/types/`
4. **API**: Use existing API client in `src/lib/`

### Step 3: Run Tests and Linting

```bash
npm test
npm run lint
npm run format
```

### Step 4: Commit and Push

```bash
git add .
git commit -m "feat: {description}"
git push -u origin {branch-name}
```

### Step 5: Create PR

```bash
gh pr create --title "{PR title}" --body "$(cat <<'EOF'
## Summary
- {description}

## Changes
- {files changed}

## Test Results
- npm test: PASS
- npm run lint: PASS
EOF
)"
```

## Notes

- Follow AGENTS.md for code style
- Use TypeScript for all files
- Use functional components with hooks
- Write tests for new components
- Follow Tailwind CSS conventions
