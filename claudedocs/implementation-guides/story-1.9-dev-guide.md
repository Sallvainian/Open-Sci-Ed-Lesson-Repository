# Story 1.9: Dev Agent Implementation Guide

## Pre-Implementation Checklist

### Source File Verification

Before starting implementation, verify these files exist and review their implementation:

```bash
# Verify source files exist
ls -l lib/api/errorHandler.ts           # ✅ Verified: 145 lines
ls -l app/api/health/route.ts            # ✅ Verified: 30 lines
ls -l components/layout/Header.tsx       # ✅ Verified: 46 lines
ls -l app/api/health/route.test.ts       # ✅ Verified: 5 existing tests
```

**Critical Source File Details:**

1. **errorHandler.ts** (lib/api/errorHandler.ts):
   - Lines 42-63: Prisma error handling (P2002, P2025, default)
   - Lines 66-72: ZodError handling (uses `error.name === 'ZodError'`)
   - Lines 76-84: Custom error with statusCode/code properties
   - Lines 88-95: Generic Error handling (environment-specific messages)
   - Lines 14-29: Logging with conditional stack trace
   - Lines 106-144: Custom error classes (NotFoundError, ValidationError, UnauthorizedError, ForbiddenError)

2. **route.ts** (app/api/health/route.ts):
   - Lines 5-7: Database connection check with `prisma.$queryRaw`
   - Lines 19-28: Error catch block (currently untested)
   - Line 24: Error message handling (instanceof Error check)

3. **Header.tsx** (components/layout/Header.tsx):
   - Lines 11-26: Logout handler with try/catch/finally
   - Line 14: Fetch API call to `/api/auth/logout`
   - Line 22: Error logging with console.error
   - Line 24: Finally block that resets isLoggingOut state

### Current Coverage Baselines

Run coverage command to confirm starting baselines:

```bash
pnpm test:coverage
```

**Expected Pre-Story Coverage:**

| File                         | Coverage | Lines  | Branches |
| ---------------------------- | -------- | ------ | -------- |
| lib/api/errorHandler.ts      | 27.77%   | 40/145 | 4/30     |
| app/api/health/route.ts      | 68.96%   | 20/30  | 3/6      |
| components/layout/Header.tsx | 66.66%   | 30/46  | 8/12     |
| Overall Project              | 58.93%   | ~400   | ~250     |

### Dependency Validation

Confirm required dependencies from package.json:

```bash
# Verify Prisma version (CRITICAL for test helpers)
grep "@prisma/client" package.json
# Expected: "@prisma/client": "^5.22.0"

# Verify testing libraries
grep -E "(vitest|@testing-library/react)" package.json
# Expected:
#   "vitest": "^1.6.1"
#   "@testing-library/react": "^14.3.1"
#   "@vitest/coverage-v8": "^1.6.1"
```

**⚠️ CRITICAL: Prisma Version Warning**

The `createPrismaError()` helper MUST use `clientVersion: '5.22.0'` to match package.json. Using wrong version causes type errors.

---

## Implementation Phases

### Phase 1: Error Handler Tests (Tasks 1-5)

**Objective:** Increase error handler coverage from 27.77% to 95%+ by testing all error paths and edge cases.

**File to Create:** `lib/api/errorHandler.test.ts`

#### Step 1.1: Create Test File Structure

Create `lib/api/errorHandler.test.ts` with this foundation:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Prisma } from '@prisma/client';
import {
  handleApiError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from './errorHandler';

// Mock console.error to prevent test output pollution
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Helper: Create Prisma error with correct constructor signature
function createPrismaError(code: string, message: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code,
    clientVersion: '5.22.0', // MUST match package.json @prisma/client version
  });
}

// Helper: Create ZodError with name property
function createZodError(message: string): Error {
  const error = new Error(message);
  error.name = 'ZodError'; // CRITICAL: Detection uses name property, not instanceof
  return error;
}

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mock call history between tests
  });

  afterEach(() => {
    vi.unstubAllEnvs(); // CRITICAL: Clean up environment stubs
  });

  // Tests go here
});
```

**Why These Helpers:**

1. **createPrismaError()**: Prisma error constructor requires `{ code, clientVersion }` object as second parameter. Must match package.json version.
2. **createZodError()**: Error handler checks `error.name === 'ZodError'`, NOT `instanceof ZodError`, so we set name property.
3. **mockConsoleError**: Error handler logs all errors. Mocking prevents console spam during testing.
4. **afterEach cleanup**: `vi.unstubAllEnvs()` prevents environment stubs from leaking between tests.

#### Step 1.2: Implement Prisma Error Tests (Task 1)

Add these tests to the `describe` block:

```typescript
describe('Prisma Errors', () => {
  it('should handle P2002 unique constraint violation (1.9-UNIT-001)', async () => {
    const error = createPrismaError(
      'P2002',
      'Unique constraint failed on the constraint: `username`'
    );
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.message).toBe('A unique constraint would be violated.');
    expect(data).toHaveProperty('timestamp');
  });

  it('should handle P2025 record not found (1.9-UNIT-002)', async () => {
    const error = createPrismaError('P2025', 'Record to update not found.');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
    expect(data.message).toBe('Record not found.');
  });

  it('should handle unknown Prisma code P9999 (1.9-UNIT-003)', async () => {
    const error = createPrismaError('P9999', 'Unknown database error');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('INTERNAL_ERROR');
    expect(data.message).toBe('Database operation failed.');
  });
});
```

**Coverage Target:** Lines 42-63 (Prisma error switch statement)

#### Step 1.3: Implement ZodError Tests (Task 2)

```typescript
describe('Validation Errors', () => {
  it('should handle ZodError (1.9-UNIT-004)', async () => {
    const error = createZodError('Validation failed: email is required');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.message).toBe('Validation failed: email is required'); // Preserves original message
  });
});
```

**Key Detail:** Error message is preserved from the ZodError, not replaced with generic message.

**Coverage Target:** Lines 66-72 (ZodError handling block)

#### Step 1.4: Implement Custom Error Class Tests (Task 3)

```typescript
describe('Custom Error Classes', () => {
  it('should handle NotFoundError (1.9-UNIT-005)', async () => {
    const error = new NotFoundError('User not found');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('NOT_FOUND');
    expect(data.message).toBe('User not found');
  });

  it('should handle ValidationError (1.9-UNIT-006)', async () => {
    const error = new ValidationError('Invalid email format');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.message).toBe('Invalid email format');
  });

  it('should handle UnauthorizedError (1.9-UNIT-007)', async () => {
    const error = new UnauthorizedError('Invalid token');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('UNAUTHORIZED');
    expect(data.message).toBe('Invalid token');
  });

  it('should handle ForbiddenError (1.9-UNIT-008)', async () => {
    const error = new ForbiddenError('Insufficient permissions');
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('FORBIDDEN');
    expect(data.message).toBe('Insufficient permissions');
  });

  it('should handle custom error with statusCode and code properties (1.9-UNIT-009)', async () => {
    const error = new Error('Custom business logic error') as Error & {
      statusCode: number;
      code: string;
    };
    error.statusCode = 422;
    error.code = 'BUSINESS_RULE_VIOLATION';

    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('BUSINESS_RULE_VIOLATION');
    expect(data.message).toBe('Custom business logic error');
  });
});
```

**Coverage Target:** Lines 76-84 (Custom error properties handling)

#### Step 1.5: Implement Environment-Specific Tests (Task 4)

```typescript
describe('Environment-Specific Behavior', () => {
  it('should return actual error message in development (1.9-UNIT-010)', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const error = new Error('Specific database connection timeout');
    const response = handleApiError(error);
    const data = await response.json();

    expect(data.message).toBe('Specific database connection timeout');
  });

  it('should return generic error message in production (1.9-UNIT-011)', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const error = new Error('Specific database connection timeout');
    const response = handleApiError(error);
    const data = await response.json();

    expect(data.message).toBe('An unexpected error occurred.');
  });

  it('should log with stack trace in development (1.9-UNIT-012)', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const error = new Error('Test error');
    handleApiError(error);

    expect(mockConsoleError).toHaveBeenCalled();
    const loggedData = mockConsoleError.mock.calls[0][1];
    expect(loggedData).toHaveProperty('stack');
  });

  it('should log without stack trace in production (1.9-UNIT-013)', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const error = new Error('Test error');
    handleApiError(error);

    expect(mockConsoleError).toHaveBeenCalled();
    const loggedData = mockConsoleError.mock.calls[0][1];
    expect(loggedData).not.toHaveProperty('stack');
  });
});
```

**Critical Pattern:** Always use `afterEach(() => vi.unstubAllEnvs())` to prevent environment leakage between tests.

**Coverage Target:** Lines 14-29 (Environment-specific logging), Lines 91-95 (Environment-specific messaging)

#### Step 1.6: Implement Edge Case Tests (Task 5)

```typescript
describe('Edge Cases', () => {
  it('should handle non-Error object (string) (1.9-UNIT-014)', async () => {
    const response = handleApiError('String error message');
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('INTERNAL_ERROR');
    expect(data.message).toBe('An unexpected error occurred.');
  });
});
```

**Coverage Target:** Lines 98-102 (Unknown error handling fallback)

#### Phase 1 Validation

Run tests to verify error handler coverage:

```bash
pnpm test errorHandler.test.ts
# Expected: 14 tests passing

pnpm test:coverage lib/api/errorHandler.ts
# Expected: Coverage 95%+ (138/145 lines, 28/30 branches)
```

---

### Phase 2: Health Endpoint Error Tests (Task 6)

**Objective:** Test error paths in health endpoint to achieve 100% coverage (from 68.96%).

**File to Modify:** `app/api/health/route.test.ts`

#### Step 2.1: Add Prisma Mock Setup

Add mock setup at the top of the test file:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/db/client';

// Mock Prisma client
vi.mock('@/lib/db/client', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Successful database query
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);
  });

  // Existing 5 tests remain unchanged
  // ...

  // Add new error tests below
});
```

#### Step 2.2: Implement Error Path Tests

Add these tests after the existing 5 tests:

```typescript
describe('Error Handling', () => {
  it('should return 503 when database query fails (1.9-INT-001)', async () => {
    // Mock database connection failure
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection refused'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.timestamp).toBeDefined();
    expect(data.error).toBe('Connection refused');
  });

  it('should handle non-Error object thrown (1.9-INT-002)', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce('String error');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.error).toBe('Unknown error'); // Fallback for non-Error objects
  });
});
```

**Coverage Target:** Lines 19-28 (catch block in health endpoint)

#### Phase 2 Validation

```bash
pnpm test route.test.ts
# Expected: 7 tests passing (5 existing + 2 new)

pnpm test:coverage app/api/health/route.ts
# Expected: Coverage 100% (30/30 lines, 6/6 branches)
```

---

### Phase 3: Header Component Tests (Tasks 7-9)

**Objective:** Test Header component error handling and loading states to achieve 100% coverage (from 66.66%).

**File to Create:** `components/layout/Header.test.tsx`

#### Step 3.1: Create Test File with Setup (Task 7)

Create `components/layout/Header.test.tsx`:

```typescript
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Header } from './Header';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Chakra UI wrapper component
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider>{children}</ChakraProvider>;
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Successful logout
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
      } as Response)
    ) as unknown as typeof fetch;
  });

  // Tests go here
});
```

**Why Chakra Wrapper:**

- Header uses Chakra UI components (Box, Flex, Heading, Button)
- ChakraProvider required for Chakra components to render
- Wrapper pattern is standard for Chakra component testing

#### Step 3.2: Implement Error Handling Tests (Task 8)

```typescript
describe('Error Handling', () => {
  it('should handle fetch network error (1.9-UNIT-015)', async () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const networkError = new Error('Network error');

    global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith('Logout failed:', networkError);
      expect(mockPush).not.toHaveBeenCalled(); // Should NOT redirect on error
    });

    mockConsoleError.mockRestore();
  });

  it('should handle fetch non-ok response (1.9-UNIT-016)', async () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      } as Response)
    ) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    // Wait for async handling
    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalled();
    });

    mockConsoleError.mockRestore();
  });

  it('should reset isLoggingOut state in finally block (1.9-UNIT-017)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Error'))) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    // Button shows loading state initially
    await waitFor(() => {
      expect(screen.getByText(/logging out/i)).toBeDefined();
    });

    // After error, loading state resets (finally block)
    await waitFor(() => {
      expect(screen.queryByText(/logging out/i)).toBeNull();
      expect(screen.getByRole('button', { name: /logout/i })).toBeDefined();
    });
  });

  it('should not redirect on error (1.9-UNIT-018)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Error'))) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
```

**Coverage Target:** Lines 21-23 (catch block), Line 24 (finally block)

**Why waitFor():**

- React state updates are asynchronous
- `fireEvent.click()` triggers handleLogout but state changes happen later
- waitFor() polls until assertion passes (default timeout 1000ms)
- Prevents flaky tests from timing issues

#### Step 3.3: Implement Loading State Tests (Task 9)

```typescript
describe('Loading State', () => {
  it('should disable button during logout (1.9-UNIT-019)', async () => {
    // Delay logout to keep loading state active
    global.fetch = vi.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                status: 200,
              } as Response),
            100
          )
        )
    ) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    // Button should show loading state
    await waitFor(() => {
      const loadingButton = screen.getByText(/logging out/i);
      expect(loadingButton).toBeDefined();
      // Chakra Button with isLoading=true is disabled
      expect(loadingButton.closest('button')).toBeDisabled();
    });
  });

  it('should enable button after error (1.9-UNIT-020)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Error'))) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    // After error, button should be enabled again
    await waitFor(() => {
      const enabledButton = screen.getByRole('button', { name: /logout/i });
      expect(enabledButton).not.toBeDisabled();
    });
  });
});
```

**Coverage Target:** Line 13 (setIsLoggingOut(true)), Line 24 (setIsLoggingOut(false) in finally)

**Testing Pattern:**

- Chakra Button with `isLoading={isLoggingOut}` automatically:
  - Shows `loadingText="Logging out..."` when true
  - Disables the button when true
  - Reverts to normal "Logout" text when false

#### Phase 3 Validation

```bash
pnpm test Header.test.tsx
# Expected: 6 tests passing

pnpm test:coverage components/layout/Header.tsx
# Expected: Coverage 100% (46/46 lines, 12/12 branches)
```

---

### Phase 4: Coverage Verification (Task 10)

**Objective:** Verify all coverage targets achieved and overall project coverage reaches 95%+.

#### Step 4.1: Run Full Coverage Report

```bash
pnpm test:coverage
```

#### Step 4.2: Verify Component-Specific Coverage

Expected output:

```
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|-------------------
lib/api/errorHandler.ts       |   95.86 |    93.33 |     100 |   95.10 | 20
app/api/health/route.ts       |     100 |      100 |     100 |     100 |
components/layout/Header.tsx  |     100 |      100 |     100 |     100 |
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   95.23 |    94.67 |   98.50 |   95.23 |
```

**Acceptable Uncovered Lines:**

- errorHandler.ts line 20: Stack trace property access (acceptable if error without stack)
- Any lines related to TypeScript type assertions (non-executable)

#### Step 4.3: Review HTML Coverage Report

```bash
# Open HTML report in browser
open coverage/index.html
```

**What to Check:**

1. **lib/api/errorHandler.ts**: All error paths green (covered)
2. **app/api/health/route.ts**: Entire catch block green
3. **components/layout/Header.tsx**: All try/catch/finally paths green
4. **Overall Coverage**: 95%+ across all metrics

#### Step 4.4: Document Coverage Results

Create summary in story completion notes:

```
## Coverage Results

### Pre-Story Baseline
- lib/api/errorHandler.ts: 27.77%
- app/api/health/route.ts: 68.96%
- components/layout/Header.tsx: 66.66%
- Overall: 58.93%

### Post-Story Achievement
- lib/api/errorHandler.ts: 95.86% (+68.09%)
- app/api/health/route.ts: 100% (+31.04%)
- components/layout/Header.tsx: 100% (+33.34%)
- Overall: 95.23% (+36.30%)

### Test Count
- Error handler: 14 tests
- Health endpoint: 2 tests (7 total)
- Header component: 6 tests
- Total new tests: 22
```

---

## Code Snippets Reference

### Helper Functions (Use Exactly As Written)

#### createPrismaError() Implementation

```typescript
function createPrismaError(code: string, message: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code,
    clientVersion: '5.22.0', // MUST match package.json @prisma/client version
  });
}
```

**⚠️ CRITICAL:** The `clientVersion` MUST be `'5.22.0'` to match package.json. Using different version causes TypeScript errors.

#### createZodError() Implementation

```typescript
function createZodError(message: string): Error {
  const error = new Error(message);
  error.name = 'ZodError'; // CRITICAL: Detection uses name property, not instanceof
  return error;
}
```

**⚠️ CRITICAL:** Error handler checks `error.name === 'ZodError'`, NOT `instanceof ZodError`. Must set name property.

### Chakra UI Wrapper Component

```typescript
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider>{children}</ChakraProvider>;
}
```

**Usage:**

```typescript
render(<Header />, { wrapper: Wrapper });
```

### Next.js Router Mock Setup

```typescript
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
```

**Verification:**

```typescript
expect(mockPush).toHaveBeenCalledWith('/login');
expect(mockPush).not.toHaveBeenCalled();
```

### Fetch Mock Patterns

#### Network Error Mock

```typescript
global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;
```

#### Non-OK Response Mock

```typescript
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    status: 500,
  } as Response)
) as unknown as typeof fetch;
```

#### Successful Response Mock

```typescript
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
  } as Response)
) as unknown as typeof fetch;
```

#### Delayed Response Mock (for loading state testing)

```typescript
global.fetch = vi.fn(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: true,
            status: 200,
          } as Response),
        100
      )
    )
) as unknown as typeof fetch;
```

### waitFor() Assertion Patterns

#### Basic Async State Assertion

```typescript
await waitFor(() => {
  expect(screen.getByText(/logging out/i)).toBeDefined();
});
```

#### Negative Assertion (element removed)

```typescript
await waitFor(() => {
  expect(screen.queryByText(/logging out/i)).toBeNull();
});
```

#### Multiple Assertions

```typescript
await waitFor(() => {
  expect(mockConsoleError).toHaveBeenCalled();
  expect(mockPush).not.toHaveBeenCalled();
});
```

---

## Testing Patterns by Type

### Unit Tests: Error Handler (14 tests)

**Pattern:** Pure function testing with mock inputs

```typescript
describe('Error Handler', () => {
  it('should handle [error type] ([test-id])', async () => {
    const error = [create error object];
    const response = handleApiError(error);
    const data = await response.json();

    expect(response.status).toBe([expected status]);
    expect(data.error).toBe('[ERROR_CODE]');
    expect(data.message).toBe('[expected message]');
  });
});
```

**Test Categories:**

- Prisma errors (3 tests): P2002, P2025, unknown
- Validation errors (1 test): ZodError
- Custom error classes (5 tests): NotFoundError, ValidationError, UnauthorizedError, ForbiddenError, custom properties
- Environment-specific (4 tests): dev message, prod message, dev logging, prod logging
- Edge cases (1 test): non-Error object

### Integration Tests: Health Endpoint (2 tests)

**Pattern:** API route testing with database mock

```typescript
describe('GET /api/health', () => {
  beforeEach(() => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);
  });

  it('should handle [error scenario] ([test-id])', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce([error]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe([expected status]);
    expect(data.status).toBe('[ok|unhealthy]');
  });
});
```

**Test Categories:**

- Database failure (1 test): Error object thrown
- Non-Error handling (1 test): String thrown

### Component Tests: Header (6 tests)

**Pattern:** React component testing with user interaction

```typescript
describe('Header Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true } as Response)) as unknown as typeof fetch;
  });

  it('should handle [interaction scenario] ([test-id])', async () => {
    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect([assertion]).toBe([expected]);
    });
  });
});
```

**Test Categories:**

- Error handling (4 tests): network error, non-ok response, state reset, no redirect
- Loading state (2 tests): button disabled, button enabled after error

---

## Success Validation

### Test Execution Success Criteria

```bash
# All tests must pass
pnpm test
# Expected: 90 tests passing (68 existing + 22 new)

# No test failures or warnings
# No flaky tests (run 3 times to verify)
pnpm test -- --reporter=verbose --run
pnpm test -- --reporter=verbose --run
pnpm test -- --reporter=verbose --run
```

### Coverage Success Criteria

#### Error Handler Coverage

```bash
pnpm test:coverage lib/api/errorHandler.ts
```

**Expected:**

- Statements: 95%+ (138/145 lines)
- Branches: 93%+ (28/30 branches)
- Functions: 100% (all functions covered)
- Lines: 95%+ (matching statements)

**Acceptable Uncovered:**

- Line 20: Stack trace property access (edge case where error has no stack)

#### Health Endpoint Coverage

```bash
pnpm test:coverage app/api/health/route.ts
```

**Expected:**

- All metrics: 100%
- Lines: 30/30
- Branches: 6/6

#### Header Component Coverage

```bash
pnpm test:coverage components/layout/Header.tsx
```

**Expected:**

- All metrics: 100%
- Lines: 46/46
- Branches: 12/12

#### Overall Project Coverage

```bash
pnpm test:coverage
```

**Expected:**

- Statements: 95%+
- Branches: 94%+
- Functions: 98%+
- Lines: 95%+

### Quality Assurance Checklist

- [ ] All 22 new tests passing
- [ ] All existing 68 tests still passing
- [ ] Error handler coverage 95%+
- [ ] Health endpoint coverage 100%
- [ ] Header component coverage 100%
- [ ] Overall project coverage 95%+
- [ ] No console errors during test execution
- [ ] No test flakiness (consistent results across 3 runs)
- [ ] HTML coverage report shows all error paths green
- [ ] Test IDs follow format: 1.9-UNIT-### or 1.9-INT-###
- [ ] All helper functions use correct signatures (Prisma version, ZodError name)
- [ ] Environment cleanup (`vi.unstubAllEnvs()`) in all environment tests
- [ ] Console mocks cleaned up properly

---

## Common Issues and Solutions

### Issue 1: Prisma Error Type Mismatch

**Symptom:**

```
TypeScript error: Type 'PrismaClientKnownRequestError' is not assignable
```

**Solution:**
Verify `clientVersion: '5.22.0'` matches package.json exactly:

```bash
grep "@prisma/client" package.json
# Must show: "^5.22.0"
```

### Issue 2: ZodError Not Detected

**Symptom:**
Test expects 400 VALIDATION_ERROR, gets 500 INTERNAL_ERROR

**Solution:**
Set `error.name = 'ZodError'` (error handler checks name property, not instanceof):

```typescript
const error = new Error(message);
error.name = 'ZodError'; // CRITICAL
```

### Issue 3: Environment Variable Leakage

**Symptom:**
Tests fail when run in different order, pass in isolation

**Solution:**
Add cleanup to afterEach:

```typescript
afterEach(() => {
  vi.unstubAllEnvs(); // CRITICAL
});
```

### Issue 4: React State Not Updated

**Symptom:**
Assertion fails immediately after fireEvent.click()

**Solution:**
Use waitFor() for async state updates:

```typescript
await waitFor(() => {
  expect(screen.getByText(/logging out/i)).toBeDefined();
});
```

### Issue 5: Chakra Components Not Rendering

**Symptom:**

```
Error: Chakra UI components require ChakraProvider
```

**Solution:**
Use Wrapper component:

```typescript
render(<Header />, { wrapper: Wrapper });
```

### Issue 6: Coverage Not Reaching 95%

**Symptom:**
Coverage stuck at 93-94%

**Solution:**

1. Check HTML report for uncovered lines
2. Verify all error paths tested
3. Test both success and failure paths
4. Test environment-specific branches (dev/prod)
5. Test edge cases (non-Error objects, etc.)

---

## Performance Expectations

### Test Execution Speed

| Test Suite                    | Test Count | Expected Time   | Acceptable Max |
| ----------------------------- | ---------- | --------------- | -------------- |
| Error handler tests           | 14         | <5 seconds      | 8 seconds      |
| Health endpoint tests         | 7 (5+2)    | <2 seconds      | 4 seconds      |
| Header component tests        | 6          | <3 seconds      | 6 seconds      |
| **Total (all project tests)** | **90**     | **<15 seconds** | **25 seconds** |

### Coverage Report Generation

- Initial coverage scan: <5 seconds
- HTML report generation: <3 seconds
- Total coverage command: <10 seconds

### Optimization Notes

- Use `vi.clearAllMocks()` instead of full restore (faster)
- Group tests with same environment in describe blocks (reduces stubbing overhead)
- Mock fetch once per test, not per assertion
- Use `beforeEach` for common setup (DRY principle)

---

## File Locations Summary

### Files to Create

```
open-science-ed-lesson-repository/
├── lib/api/errorHandler.test.ts           # NEW - 14 unit tests
├── components/layout/Header.test.tsx      # NEW - 6 component tests
```

### Files to Modify

```
open-science-ed-lesson-repository/
├── app/api/health/route.test.ts           # MODIFY - Add 2 error tests
```

### Existing Files (Reference Only)

```
open-science-ed-lesson-repository/
├── lib/api/errorHandler.ts                # Source being tested
├── app/api/health/route.ts                # Health endpoint source
├── components/layout/Header.tsx           # Header component source
├── package.json                           # Dependency versions
```

---

## Final Implementation Checklist

### Pre-Implementation

- [ ] Read story file: `docs/stories/1.9.story.md`
- [ ] Verify source files exist (errorHandler.ts, route.ts, Header.tsx)
- [ ] Confirm current coverage baselines (58.93% overall)
- [ ] Validate Prisma version in package.json (5.22.0)

### Phase 1: Error Handler Tests

- [ ] Create `lib/api/errorHandler.test.ts`
- [ ] Implement helper functions (createPrismaError, createZodError)
- [ ] Implement Prisma error tests (3 tests: P2002, P2025, unknown)
- [ ] Implement ZodError test (1 test)
- [ ] Implement custom error class tests (5 tests: NotFoundError, ValidationError, UnauthorizedError, ForbiddenError, custom)
- [ ] Implement environment-specific tests (4 tests: dev message, prod message, dev logging, prod logging)
- [ ] Implement edge case test (1 test: non-Error object)
- [ ] Verify 14 tests passing
- [ ] Verify error handler coverage 95%+

### Phase 2: Health Endpoint Error Tests

- [ ] Modify `app/api/health/route.test.ts`
- [ ] Add Prisma mock setup
- [ ] Implement database failure test (1 test: Error object)
- [ ] Implement non-Error handling test (1 test: String object)
- [ ] Verify 7 total tests passing (5 existing + 2 new)
- [ ] Verify health endpoint coverage 100%

### Phase 3: Header Component Tests

- [ ] Create `components/layout/Header.test.tsx`
- [ ] Setup Chakra wrapper and router mock
- [ ] Implement error handling tests (4 tests: network error, non-ok response, state reset, no redirect)
- [ ] Implement loading state tests (2 tests: button disabled, button enabled)
- [ ] Verify 6 tests passing
- [ ] Verify Header component coverage 100%

### Phase 4: Coverage Verification

- [ ] Run `pnpm test:coverage`
- [ ] Verify error handler coverage 95%+
- [ ] Verify health endpoint coverage 100%
- [ ] Verify Header component coverage 100%
- [ ] Verify overall project coverage 95%+
- [ ] Review HTML coverage report
- [ ] Document any intentionally uncovered lines

### Quality Assurance

- [ ] All 90 tests passing (68 existing + 22 new)
- [ ] No test flakiness (3 consecutive runs pass)
- [ ] No console errors during execution
- [ ] Test IDs follow naming convention
- [ ] All acceptance criteria met

### Documentation

- [ ] Update story with completion notes
- [ ] Document coverage improvements
- [ ] Note any deviations from plan
- [ ] List all modified/created files
