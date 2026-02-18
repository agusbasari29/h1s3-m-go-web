# AGENTS - Frontend (Next.js)

## 1. Purpose

- Equip autonomous agents with shared expectations for the Next.js frontend codebase.
- Keep this file authoritative for frontend development.

## 2. Repository Snapshot

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS for styling
- API integration with h1s3-m-go backend

## 3. Toolchain Summary

- Node.js 20+
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ESLint + Prettier
- Jest + React Testing Library

## 4. Commands

### Development

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Testing

```bash
npm test           # Run tests
npm test:watch    # Watch mode
npm test:coverage # Coverage report
```

### Code Quality

```bash
npm run format     # Prettier formatting
npm run lint       # ESLint check
```

## 5. Project Structure

```
src/
├── app/              # Next.js App ├── page.tsx Router
│        # Home page
│   ├── layout.tsx    # Root layout
│   └── api/          # API routes (if needed)
├── components/       # React components
│   ├── ui/           # Base UI components
│   └── features/     # Feature-specific components
├── lib/              # Utilities
├── types/            # TypeScript types
└── app/globals.css   # Tailwind imports
```

## 6. Code Style

### General

- Use TypeScript for all files
- Prefer functional components with hooks
- Use `const` over `var`
- Use meaningful variable names

### Naming

- Components: PascalCase (e.g., DeviceCard.tsx)
- Hooks: camelCase with prefix (e.g., useDevices)
- Types: PascalCase (e.g., DeviceResponse)
- Files: kebab-case (e.g., device-list.tsx)

### Tailwind CSS

- Use utility classes for styling
- Keep custom CSS minimal
- Follow mobile-first approach

### Imports

- Group: external (node_modules), internal (components/lib), types
- Sort alphabetically within groups

## 7. API Integration

### Base URL

- Development: `http://localhost:8080/api/v1`
- Production: Env variable `NEXT_PUBLIC_API_URL`

### Authentication

- JWT stored in localStorage
- Include in headers: `Authorization: Bearer <token>`

### Error Handling

- Use try/catch for API calls
- Display user-friendly error messages
- Log errors for debugging

## 8. Testing Guidance

- Write unit tests for components
- Use React Testing Library
- Mock API calls with MSW or fetch mocks
- Test both success and error states

## 9. Component Guidelines

### UI Components (src/components/ui/)

- Reusable, dumb components
- No business logic
- Props-driven

### Feature Components (src/components/features/)

- Business logic allowed
- Can use hooks
- Integration with API

## 10. State Management

- Use React useState/useReducer for local state
- Use Context for global state (auth, theme)
- Consider React Query for server state

## 11. Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 12. When In Doubt

- Follow Next.js official docs
- Check existing components for patterns
- Prioritize readability over cleverness
