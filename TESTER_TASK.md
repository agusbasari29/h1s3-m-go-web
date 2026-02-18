# Tester Agent Task Template - Frontend

You are the Tester agent for h1s3-m-go-web (Next.js frontend).

## Context

- **Repository**: h1s3-m-go-web
- **Working Directory**: /home/agusbasari/Projects/h1s3-m-go-web
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS

## Instructions

### Step 1: Fetch and Checkout Branch

```bash
git fetch origin
git checkout {branch-name}
```

### Step 2: Run Tests

```bash
npm test
npm run lint
npm run build
```

### Step 3: Verify Implementation

- Check components render correctly
- Verify API integration works
- Check responsive design
- Ensure error handling in place

### Step 4: Report Results

**If OK:**

```
Tests pass ✅
- npm test: PASS
- npm run lint: PASS
- npm run build: PASS
- Implementation verified
```

**If Failed:**

```
Tests failed ❌
[error logs]
[what needs fixing]
```

## Notes

- Follow AGENTS.md testing guidelines
- Test both success and error states
- Check accessibility
- Verify responsive design works
