---
name: builder
description: Implements planned features in Next.js with TypeScript, testing, and best practices
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: implementation
  project: h1s3-m-go-web
---

## What I do

- Implement planned features from task breakdown
- Create reusable TypeScript components
- Implement API integration with error handling
- Write comprehensive unit tests
- Follow code quality standards
- Run quality checks (lint, test, format)
- Create pull requests with clear descriptions

## When to use me

Use this when:

- You have a detailed task breakdown
- Need to create components or pages
- Implementing API integration
- Writing tests
- Preparing code for review

## How I work

1. **Setup branch** - Create feature branch from main
2. **Implement features**:
   - Create components with TypeScript
   - Implement API clients
   - Define types and interfaces
   - Handle error states
3. **Write tests** - Unit tests for all new code
4. **Quality checks** - Run npm test, lint, format
5. **Commit changes** - Proper commit messages
6. **Create PR** - Push branch and generate pull request

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Jest + React Testing Library
- ESLint + Prettier

## Code standards

**Components**: PascalCase (DeviceCard.tsx)
**Files**: kebab-case (device-list.tsx)
**Types**: camelCase (device.ts)
**Imports**: external → internal → types (sorted alphabetically)

**React patterns**:

- Functional components only
- Hooks for state
- Proper TypeScript typing
- Error boundaries
- Loading states

**Tailwind CSS**:

- Mobile-first approach
- Utility classes only
- Responsive breakpoints
- No custom CSS when possible

## Testing requirements

- Tests for all components
- Tests cover success and error states
- Tests cover edge cases
- Mock API responses
- Use React Testing Library
- Test accessibility
- Verify responsive design

## Example

```
Task: Create device list component

1. Create DeviceList.tsx
   - Use TypeScript with proper types
   - Handle loading and error states
   - Implement API integration
   - Use Tailwind CSS

2. Create DeviceCard.tsx
   - Reusable card component
   - Handle refresh functionality
   - Show status with colors

3. Create types in device.ts
   - Device interface
   - DeviceResponse type
   - API request/response types

4. Write tests
   - DeviceList.test.tsx
   - DeviceCard.test.tsx

5. Run quality checks
   - npm test
   - npm run lint
   - npm run format

6. Commit and create PR
```
