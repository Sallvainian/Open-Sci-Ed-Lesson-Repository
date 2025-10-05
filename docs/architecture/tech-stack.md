# Technology Stack Architecture

**Project**: Open Science Education Lesson Repository
**Last Updated**: 2025-10-05
**Status**: Active Development (MVP Phase)

---

## Overview

This document defines the technical architecture, technology choices, and architectural decisions for the Open Science Education Lesson Repository project.

---

## Core Technology Stack

### Frontend Framework

**Technology**: Next.js 14.2.20
**Type**: React-based full-stack framework
**Rationale**:

- Server-side rendering (SSR) for fast initial page loads
- File-based routing for predictable navigation structure
- Built-in API routes for backend functionality
- Excellent developer experience with Fast Refresh
- Strong ecosystem and community support

**Key Features Used**:

- App Router (Next.js 13+ architecture)
- Server Components for performance optimization
- API Routes for backend endpoints
- Static generation for content pages

### UI Framework

**Technology**: Chakra UI 2.10.9
**Type**: Component library with built-in accessibility
**Rationale**:

- Accessibility-first design (WCAG compliant)
- Consistent design system out of the box
- Responsive by default
- Emotion-based styling for flexibility

**Supporting Libraries**:

- Framer Motion 10.18.0 - animations and transitions
- Lucide React 0.294.0 - icon system

### State Management

**Technology**: Zustand 4.5.7
**Type**: Lightweight React state management
**Rationale**:

- Simple API with minimal boilerplate
- No Context Provider wrapper hell
- TypeScript-first design
- Excellent performance characteristics

**Server State**: TanStack Query 5.90.2
**Rationale**:

- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- DevTools for debugging

### Form Management

**Technology**: React Hook Form 7.64.0 + Zod 3.25.76
**Rationale**:

- Minimal re-renders (performance)
- Schema-based validation with TypeScript integration
- Excellent error handling
- Native HTML5 validation support

---

## Backend Architecture

### Database

**Technology**: Prisma 5.22.0 (ORM) + Database TBD
**Type**: Type-safe database toolkit
**Rationale**:

- Auto-generated TypeScript types
- Migration system built-in
- Excellent developer experience
- Cross-database compatibility

**Planned Database**: Supabase PostgreSQL
**Current Status**: Schema design in progress

### Authentication

**Technology**: Supabase Auth 2.58.0 + JWT (jsonwebtoken 9.0.2)
**Type**: Backend-as-a-Service authentication
**Rationale**:

- Row-level security (RLS) for data access control
- Built-in OAuth providers
- JWT-based session management
- Integrates with Prisma for user data

**Security**:

- Password hashing: bcryptjs 3.0.2
- Unique IDs: nanoid 5.1.6

---

## Module System Architecture

### **ARCHITECTURAL DECISION: ECMAScript Modules (ESM)**

**Decision Date**: 2025-10-05
**Status**: Active
**Decision**: This project adopts **ESM (ECMAScript Modules)** as the standard module system.

#### Configuration

```json
// package.json
{
  "type": "module"
}
```

**Config File Conventions**:

- Next.js config: `next.config.mjs` (ESM syntax)
- Vite config: `vite.config.ts` (ESM syntax)
- Vitest config: `vitest.config.ts` (ESM syntax)
- All TypeScript files: `import`/`export` syntax

#### Rationale

1. **Ecosystem Alignment**: Node.js, Next.js 15+, and Vite are all ESM-native
2. **Eliminates Warnings**: Resolves Vite CJS deprecation warnings
3. **Future-Proof**: Next.js 15 (Oct 2024) is ESM-first
4. **Consistency**: Single module paradigm across entire codebase
5. **TypeScript Integration**: Natural fit with TypeScript's import/export

#### Migration History

- **2025-10-05**: Added `"type": "module"` to package.json (Story 1.8)
- **2025-10-05**: Converted `next.config.js` → `next.config.mjs` with ESM syntax
- **Result**: Eliminated Vite CJS warnings, fixed linting failures, achieved full ESM adoption

#### Import/Export Standards

```typescript
// ✅ Correct - ESM syntax (default for all .ts, .tsx, .js files)
import { Component } from 'react';
import type { NextConfig } from 'next';
export default MyComponent;
export { namedExport };

// ❌ Incorrect - CJS syntax (only allowed in .cjs files if absolutely necessary)
const { Component } = require('react');
module.exports = MyComponent;
```

#### Special Cases

- **`.mjs` files**: Explicitly ESM (used for config files like `next.config.mjs`)
- **`.cjs` files**: Explicitly CommonJS (use only when external dependency requires CJS)
- **`.ts`/`.tsx` files**: Follow `package.json` "type" field (ESM in this project)

#### Tooling Compatibility

| Tool                     | ESM Support       | Configuration                        |
| ------------------------ | ----------------- | ------------------------------------ |
| Next.js 14.2.20          | ✅ Full support   | `next.config.mjs`                    |
| Vite 5.x                 | ✅ Native ESM     | `vite.config.ts`                     |
| Vitest 1.6.1             | ✅ Full support   | `vitest.config.ts`                   |
| TypeScript 5.9.3         | ✅ Full support   | Respects `package.json` type         |
| Prisma 5.22.0            | ✅ Full support   | Works with ESM                       |
| tsx (TypeScript Execute) | ✅ Auto-detection | Handles both based on `package.json` |

---

## Testing Architecture

### Unit Testing

**Technology**: Vitest 1.6.1
**Type**: Vite-native test framework
**Rationale**:

- Fast execution (uses Vite's transformation pipeline)
- Compatible with Jest API (easy migration)
- Native ESM support
- Excellent TypeScript integration

**Testing Library**: @testing-library/react 14.3.1
**Rationale**:

- User-centric testing approach
- Encourages accessibility-focused tests
- Industry standard for React testing

**Coverage**: @vitest/coverage-v8 1.6.1

### E2E Testing

**Technology**: Playwright 1.55.1
**Type**: Browser automation and testing
**Rationale**:

- Cross-browser testing (Chromium, Firefox, WebKit)
- Fast, reliable test execution
- Excellent debugging tools
- Auto-wait and retry mechanisms

---

## Development Tools

### TypeScript

**Version**: 5.9.3
**Configuration**: Strict mode enabled
**Rationale**:

- Type safety across entire stack
- Enhanced IDE support
- Catches errors at compile time
- Self-documenting code

### Code Quality

**Linter**: ESLint 8.57.1
**Config**: eslint-config-next 14.0.0
**Formatter**: Prettier 3.6.2
**Pre-commit**: Husky 9.1.7 + lint-staged 16.2.3

**Standards**:

- TypeScript ESLint rules enforced
- Prettier for consistent formatting
- Automatic lint-fix on commit
- Type checking as part of CI/CD

### Build Tool

**Technology**: Next.js built-in (Turbopack in dev, Webpack for production)
**Testing Build**: Vite 5.x (via Vitest)
**Rationale**:

- Next.js handles production builds
- Vite provides fast test execution
- Both are ESM-native and compatible

---

## Infrastructure & Deployment

### Hosting

**Platform**: Vercel (recommended for Next.js)
**Current Status**: Not yet deployed
**Rationale**:

- Zero-config deployment for Next.js
- Automatic HTTPS and CDN
- Serverless functions for API routes
- Preview deployments for PRs

**Analytics**:

- @vercel/analytics 1.5.0 - user analytics
- @vercel/speed-insights 1.2.0 - performance monitoring

### File Storage

**Strategy**: In-app hosting for educational materials
**Technology**: TBD (likely Supabase Storage or Vercel Blob)
**Requirements**:

- PDF hosting for lesson documents
- Image/video storage for educational media
- Fast CDN delivery
- Access control integration

---

## Architecture Principles

### Module System

- **ESM-First**: All code uses ECMAScript Modules
- **Explicit Extensions**: Config files use explicit extensions (.mjs, .ts)
- **No Mixed Paradigms**: Avoid mixing CJS and ESM in the same context

### Code Organization

- **Feature-Based Structure**: Organize by feature/domain, not file type
- **Colocation**: Keep related code close (components, tests, styles)
- **Clear Boundaries**: Separate client/server code explicitly

### Performance

- **Server Components Default**: Use React Server Components for static content
- **Client Components Selective**: Only use 'use client' when necessary
- **Code Splitting**: Leverage Next.js automatic code splitting
- **Optimistic Updates**: Use TanStack Query for instant UI feedback

### Security

- **Environment Variables**: Never commit secrets, use .env.local
- **Input Validation**: Zod schemas for all user input
- **XSS Prevention**: React's automatic escaping + Content Security Policy
- **CSRF Protection**: Next.js built-in CSRF protection

### Developer Experience

- **Type Safety**: TypeScript strict mode throughout
- **Fast Feedback**: Vite for instant test execution
- **Hot Reload**: Next.js Fast Refresh for instant updates
- **Clear Errors**: Detailed error messages in development

---

## Technology Decision Log

### Next.js 14 vs Next.js 15

**Decision**: Next.js 14.2.20
**Date**: Project initialization
**Rationale**: Stable release, production-ready, excellent documentation. Will upgrade to 15+ after MVP when ecosystem stabilizes.

### Chakra UI vs Tailwind CSS

**Decision**: Chakra UI 2.10.9
**Date**: Project initialization
**Rationale**: Accessibility-first approach aligns with educational context. Component library reduces development time. Emotion provides styling flexibility.

### Zustand vs Redux

**Decision**: Zustand 4.5.7
**Date**: Project initialization
**Rationale**: Simpler API, less boilerplate, better TypeScript integration. Client-side state needs are minimal (most state is server-driven via TanStack Query).

### Prisma vs Drizzle

**Decision**: Prisma 5.22.0
**Date**: Project initialization
**Rationale**: Superior TypeScript integration, excellent migration system, auto-generated types. Developer experience prioritized for single-developer project.

### Vitest vs Jest

**Decision**: Vitest 1.6.1
**Date**: Project initialization
**Rationale**: Native ESM support, faster execution via Vite, compatible with Jest API for easy migration path. Better integration with Vite-based tooling.

### ESM vs CommonJS

**Decision**: ESM (ECMAScript Modules)
**Date**: 2025-10-05
**Rationale**: See "Module System Architecture" section above for comprehensive analysis.

---

## Future Considerations

### Potential Upgrades

- **Next.js 15**: Upgrade after MVP, when ecosystem matures
- **React 19**: Upgrade when Next.js 15 stable release includes it
- **Supabase Realtime**: Consider for collaborative features (post-MVP)

### Monitoring Needs

- **Error Tracking**: Consider Sentry integration for production
- **Performance Monitoring**: Vercel Speed Insights currently enabled
- **User Analytics**: Vercel Analytics currently enabled

### Scalability Considerations

- **Edge Runtime**: Evaluate for API routes if latency becomes critical
- **Database Scaling**: Supabase provides automatic scaling, monitor usage
- **CDN Optimization**: Vercel Edge Network handles this automatically

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
