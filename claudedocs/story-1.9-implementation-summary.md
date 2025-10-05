# Story 1.9 Implementation Guide - Summary

**Created:** 2025-10-05
**Story:** Error Handler, Health Endpoint, and Header Component Tests
**Target Coverage:** 95%+ (from 58.93%)
**New Tests:** 22 tests across 3 test suites

## Quick Start

### 1. Read the Full Guide

```bash
cat claudedocs/implementation-guides/story-1.9-dev-guide.md
```

### 2. Key Implementation Steps

**Phase 1:** Error Handler Tests (14 tests)

- Create `lib/api/errorHandler.test.ts`
- Use provided helper functions (createPrismaError, createZodError)
- Test all error types: Prisma, ZodError, custom classes, environment-specific

**Phase 2:** Health Endpoint Error Tests (2 tests)

- Modify `app/api/health/route.test.ts`
- Mock Prisma client to test error paths
- Test database failures and non-Error objects

**Phase 3:** Header Component Tests (6 tests)

- Create `components/layout/Header.test.tsx`
- Setup Chakra wrapper and router mocks
- Test error handling and loading states with waitFor()

**Phase 4:** Coverage Verification

- Run `pnpm test:coverage`
- Verify all targets met (95%+)

## Critical Implementation Details

### ⚠️ Prisma Version Warning

```typescript
// MUST use exact version from package.json
function createPrismaError(code: string, message: string) {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code,
    clientVersion: '5.22.0', // ← CRITICAL: Match package.json
  });
}
```

### ⚠️ ZodError Detection Pattern

```typescript
// Error handler checks name property, NOT instanceof
function createZodError(message: string): Error {
  const error = new Error(message);
  error.name = 'ZodError'; // ← CRITICAL: Must set name property
  return error;
}
```

### ⚠️ Environment Variable Cleanup

```typescript
describe('Tests', () => {
  afterEach(() => {
    vi.unstubAllEnvs(); // ← CRITICAL: Prevent leakage
  });
});
```

## Coverage Targets

| File                         | Before     | After    | Improvement |
| ---------------------------- | ---------- | -------- | ----------- |
| lib/api/errorHandler.ts      | 27.77%     | 95%+     | +68%        |
| app/api/health/route.ts      | 68.96%     | 100%     | +31%        |
| components/layout/Header.tsx | 66.66%     | 100%     | +33%        |
| **Overall Project**          | **58.93%** | **95%+** | **+36%**    |

## Test Distribution

| Test Suite          | Test Count | Test IDs                     |
| ------------------- | ---------- | ---------------------------- |
| Error Handler       | 14         | 1.9-UNIT-001 to 1.9-UNIT-014 |
| Health Endpoint     | 2          | 1.9-INT-001 to 1.9-INT-002   |
| Header Component    | 6          | 1.9-UNIT-015 to 1.9-UNIT-020 |
| **Total New Tests** | **22**     | **1.9-UNIT/INT-001 to 020**  |

## Success Validation Commands

```bash
# Run all tests
pnpm test
# Expected: 90 tests passing (68 existing + 22 new)

# Check coverage
pnpm test:coverage
# Expected: Overall 95%+

# Verify specific files
pnpm test:coverage lib/api/errorHandler.ts
pnpm test:coverage app/api/health/route.ts
pnpm test:coverage components/layout/Header.tsx

# HTML report
open coverage/index.html
```

## Common Pitfalls to Avoid

1. **Wrong Prisma clientVersion** → Use `'5.22.0'` from package.json
2. **Missing ZodError name property** → Set `error.name = 'ZodError'`
3. **Environment variable leakage** → Always use `vi.unstubAllEnvs()` in afterEach
4. **React state timing issues** → Use `waitFor()` for async assertions
5. **Missing Chakra wrapper** → Use `render(<Header />, { wrapper: Wrapper })`

## Reference Files

### Full Implementation Guide

- **Location:** `claudedocs/implementation-guides/story-1.9-dev-guide.md`
- **Content:** Step-by-step instructions, code snippets, troubleshooting

### Story Definition

- **Location:** `docs/stories/1.9.story.md`
- **Content:** Acceptance criteria, tasks, dev notes

### Source Files

- `lib/api/errorHandler.ts` (145 lines)
- `app/api/health/route.ts` (30 lines)
- `components/layout/Header.tsx` (46 lines)

## Next Steps for Dev Agent

1. Read full implementation guide
2. Verify pre-implementation checklist
3. Execute Phase 1-4 in sequence
4. Validate coverage targets
5. Document completion in story file
