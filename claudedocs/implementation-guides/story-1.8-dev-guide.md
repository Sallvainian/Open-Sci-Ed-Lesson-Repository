# Story 1.8: Dev Agent Implementation Guide

## Overview

This guide provides step-by-step implementation instructions for Story 1.8: Middleware Integration Tests + Vite CJS Fix. The story involves creating 20 integration tests for authentication middleware and eliminating Vite CJS deprecation warnings.

**Estimated Implementation Time**: 3-4 hours

**Success Criteria**:

- All 20 integration tests passing
- No Vite CJS warnings during test/dev execution
- Middleware coverage reaches 95%+ (from current 0%)
- Test execution completes in <10 seconds

---

## Pre-Implementation Checklist

### Environment Verification

```bash
# 1. Verify you're in the correct directory
pwd
# Expected: /home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository

# 2. Verify middleware.ts exists
ls -la middleware.ts
# Expected: File exists in project root

# 3. Verify lib/auth/jwt.ts exists (module to mock)
ls -la lib/auth/jwt.ts
# Expected: File exists with verifyToken function

# 4. Check current test coverage baseline
pnpm test:coverage
# Expected: middleware.ts shows 0% coverage or is absent from report

# 5. Verify Vite CJS warning is present
pnpm test 2>&1 | grep -i "deprecated"
# Expected: Warning about CJS Node API from Vite 5
```

### Dependency Confirmation

All required dependencies should already be installed:

- `vitest` - Testing framework
- `@vitejs/plugin-react` - Already configured
- `next` - NextRequest/NextResponse types

If any are missing:

```bash
pnpm install -D vitest @vitest/coverage-v8
```

### Source File Validation

**Read middleware.ts** to understand:

- Public paths array (4 paths)
- Authentication logic flow
- CORS configuration
- Response header patterns
- Logging format

```bash
# Read middleware.ts
cat middleware.ts
```

**Expected Public Paths**:

```typescript
const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout', '/api/health'];
```

---

## Implementation Phases

### Phase 1: Package.json Fix (Task 1)

**Objective**: Eliminate Vite CJS deprecation warning by adding `"type": "module"` to package.json

**Background**: Vite 5 requires explicit ES module declaration. All project files already use ESM syntax (import/export).

#### Step 1.1: Modify package.json

```bash
# Read current package.json to understand structure
cat package.json | head -20
```

**Exact Modification**:

Open `package.json` and add `"type": "module"` after the `"private": true` field:

```json
{
  "name": "open-science-ed-lesson-repository",
  "version": "0.1.0",
  "private": true,
  "type": "module", // ADD THIS LINE
  "scripts": {
    // ... rest of package.json
  }
}
```

**Edit Command**:

```typescript
// Use Edit tool to add the line
// old_string: should include "private": true and the next line
// new_string: should include "private": true, "type": "module", and the next line
```

#### Step 1.2: Verify Fix Works

```bash
# Test 1: Verify no CJS warnings during tests
pnpm test 2>&1 | grep -i "deprecated"
# Expected: NO output (warning eliminated)

# Test 2: Verify dev server starts without warnings
pnpm dev 2>&1 | head -20
# Expected: Clean startup, no CJS warnings

# Stop dev server with Ctrl+C
```

#### Step 1.3: Commit Fix

**Commit separately before implementing tests** to isolate concerns:

```bash
git add package.json
git commit -m "fix: Add type: module to eliminate Vite CJS deprecation warning

- Add \"type\": \"module\" declaration to package.json
- Fixes Vite 5 CJS Node API deprecation warning
- All project files already use ESM syntax (import/export)

Story: 1.8 (Task 1)
Test: Verified no warnings with pnpm test and pnpm dev"
```

**Expected Result**: ✅ No Vite warnings in test or dev mode

---

### Phase 2: Test Infrastructure (Tasks 2-3)

**Objective**: Create middleware.test.ts with helper functions and mock setup

#### Step 2.1: Create Test File Structure

Create `middleware.test.ts` in project root (same level as middleware.ts):

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import * as jwt from '@/lib/auth/jwt';

// Mock the JWT module
vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));

// Mock console.log to prevent test output pollution
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Middleware Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  // Tests will go here
});
```

**File Location**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/middleware.test.ts`

#### Step 2.2: Implement NextRequest Helper Function

Add this helper function inside the test file (before the describe block):

```typescript
/**
 * Create a mock NextRequest for testing middleware
 *
 * @param pathname - The request path (e.g., '/dashboard', '/api/users')
 * @param options - Configuration options
 * @param options.method - HTTP method (default: 'GET')
 * @param options.token - Auth token value (sets auth-token cookie via Cookie header)
 * @param options.origin - Origin header value for CORS testing
 * @returns NextRequest instance configured for testing
 *
 * CRITICAL: Use Cookie header for auth token (not NextRequest.cookies)
 * NextRequest.cookies is read-only and cannot be modified via constructor.
 * Cookie header parsing happens automatically by Next.js.
 */
function createMockRequest(
  pathname: string,
  options: {
    method?: string;
    token?: string;
    origin?: string;
  } = {}
): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();

  // Set auth token via Cookie header (read-only cookies workaround)
  if (options.token) {
    headers.set('cookie', `auth-token=${options.token}`);
  }

  // Set Origin header for CORS testing
  if (options.origin) {
    headers.set('origin', options.origin);
  }

  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
  });
}
```

**Why This Approach**:

- NextRequest.cookies is read-only RequestCookies object
- Cannot be modified via constructor
- Cookie header approach matches production behavior
- Automatic parsing by Next.js middleware

#### Step 2.3: Verify Test Infrastructure

```bash
# Run empty test suite to verify imports and setup
pnpm test middleware.test.ts

# Expected output:
# ✓ middleware.test.ts (0 tests)
# Tests: 0 passed, 0 total
```

**Expected Result**: ✅ Test file runs without import errors

---

### Phase 3: Test Scenarios (Tasks 4-12)

**Objective**: Implement all 20 test scenarios grouped by category

#### Category 1: Public Path Tests (Task 4)

**Tests**: 1.8-INT-001 through 1.8-INT-004

Add inside the describe block:

```typescript
describe('Public Paths (No Authentication Required)', () => {
  it('should allow access to /login without authentication (1.8-INT-001)', async () => {
    const request = createMockRequest('/login');
    const response = await middleware(request);

    // Public path should allow access
    expect(response.status).toBe(200);

    // Verify verifyToken was NOT called for public path
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });

  it('should allow access to /api/auth/login without authentication (1.8-INT-002)', async () => {
    const request = createMockRequest('/api/auth/login', { method: 'POST' });
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });

  it('should allow access to /api/auth/logout without authentication (1.8-INT-003)', async () => {
    const request = createMockRequest('/api/auth/logout', { method: 'POST' });
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });

  it('should allow access to /api/health without authentication (1.8-INT-004)', async () => {
    const request = createMockRequest('/api/health');
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 4 tests passing
```

#### Category 2: OPTIONS Request Handling (Task 5)

**Test**: 1.8-INT-005

```typescript
describe('OPTIONS Request Handling', () => {
  it('should return 200 with CORS headers for OPTIONS requests without authentication (1.8-INT-005)', async () => {
    const request = createMockRequest('/api/users', {
      method: 'OPTIONS',
      origin: 'http://localhost:3000',
    });
    const response = await middleware(request);

    // OPTIONS should return 200
    expect(response.status).toBe(200);

    // Verify CORS headers are set
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('PUT');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('DELETE');
    expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');

    // No authentication check should be performed
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 5 tests passing
```

#### Category 3: Protected Routes - No Token (Task 6)

**Tests**: 1.8-INT-006 through 1.8-INT-008

```typescript
describe('Protected Routes - No Token', () => {
  it('should redirect to /login when accessing /dashboard without token (1.8-INT-006)', async () => {
    const request = createMockRequest('/dashboard');
    const response = await middleware(request);

    // Protected page should redirect with 303 See Other
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('should redirect to /login when accessing / without token (1.8-INT-007)', async () => {
    const request = createMockRequest('/');
    const response = await middleware(request);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('should return 401 JSON when accessing /api/users without token (1.8-INT-008)', async () => {
    const request = createMockRequest('/api/users');
    const response = await middleware(request);

    // Protected API should return 401 JSON
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toBe('UNAUTHORIZED');
    expect(data.message).toBe('Authentication required');
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 8 tests passing
```

#### Category 4: Protected Routes - Invalid Token (Task 7)

**Tests**: 1.8-INT-009 through 1.8-INT-011

```typescript
describe('Protected Routes - Invalid Token', () => {
  beforeEach(() => {
    // Mock verifyToken to return null (invalid token scenario)
    vi.mocked(jwt.verifyToken).mockReturnValue(null);
  });

  it('should redirect to /login when accessing /dashboard with invalid token (1.8-INT-009)', async () => {
    const request = createMockRequest('/dashboard', { token: 'invalid-token' });
    const response = await middleware(request);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');

    // Verify verifyToken was called with the token
    expect(jwt.verifyToken).toHaveBeenCalledWith('invalid-token');
  });

  it('should redirect to /login when accessing / with invalid token (1.8-INT-010)', async () => {
    const request = createMockRequest('/', { token: 'expired-token' });
    const response = await middleware(request);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    expect(jwt.verifyToken).toHaveBeenCalledWith('expired-token');
  });

  it('should return 401 JSON when accessing /api/users with invalid token (1.8-INT-011)', async () => {
    const request = createMockRequest('/api/users', { token: 'bad-token' });
    const response = await middleware(request);

    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toBe('UNAUTHORIZED');
    expect(data.message).toBe('Authentication required');

    expect(jwt.verifyToken).toHaveBeenCalledWith('bad-token');
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 11 tests passing
```

#### Category 5: Protected Routes - Valid Token (Task 8)

**Tests**: 1.8-INT-012 through 1.8-INT-013

```typescript
describe('Protected Routes - Valid Token', () => {
  beforeEach(() => {
    // Mock verifyToken to return valid payload
    vi.mocked(jwt.verifyToken).mockReturnValue({
      username: 'teacher',
      id: '1',
    });
  });

  it('should allow access to /dashboard with valid token (1.8-INT-012)', async () => {
    const request = createMockRequest('/dashboard', { token: 'valid-jwt-token' });
    const response = await middleware(request);

    // Status 200 indicates NextResponse.next() was called (middleware passed through)
    expect(response.status).toBe(200);

    // Verify token was validated
    expect(jwt.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
  });

  it('should allow access to /api/users with valid token (1.8-INT-013)', async () => {
    const request = createMockRequest('/api/users', { token: 'valid-api-token' });
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(jwt.verifyToken).toHaveBeenCalledWith('valid-api-token');
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 13 tests passing
```

#### Category 6: CORS Origin Validation (Task 9)

**Tests**: 1.8-INT-014 through 1.8-INT-016

```typescript
describe('CORS Origin Validation', () => {
  it('should set matching Allow-Origin for localhost:3000 (1.8-INT-014)', async () => {
    const request = createMockRequest('/api/health', {
      origin: 'http://localhost:3000',
    });
    const response = await middleware(request);

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('should allow *.vercel.app domains (1.8-INT-015)', async () => {
    const request = createMockRequest('/api/health', {
      origin: 'https://my-project.vercel.app',
    });
    const response = await middleware(request);

    // Vercel.app domain should be allowed (wildcard pattern match)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://my-project.vercel.app'
    );
  });

  it('should default to same-origin when no origin header present (1.8-INT-016)', async () => {
    const request = createMockRequest('/api/health');
    const response = await middleware(request);

    // When no origin header, should use request URL origin
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 16 tests passing
```

#### Category 7: Headers and Caching (Task 10)

**Test**: 1.8-INT-017

```typescript
describe('Headers and Caching', () => {
  it('should set x-middleware-cache: no-cache on all responses (1.8-INT-017)', async () => {
    // Test with public path
    const publicRequest = createMockRequest('/login');
    const publicResponse = await middleware(publicRequest);
    expect(publicResponse.headers.get('x-middleware-cache')).toBe('no-cache');

    // Test with protected path (no token - will redirect)
    const protectedRequest = createMockRequest('/dashboard');
    const protectedResponse = await middleware(protectedRequest);
    expect(protectedResponse.headers.get('x-middleware-cache')).toBe('no-cache');

    // Test with API path (no token - will return 401)
    const apiRequest = createMockRequest('/api/users');
    const apiResponse = await middleware(apiRequest);
    expect(apiResponse.headers.get('x-middleware-cache')).toBe('no-cache');
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 17 tests passing
```

#### Category 8: Request Logging (Task 11)

**Test**: 1.8-INT-018

```typescript
describe('Request Logging', () => {
  it('should log requests with timestamp, method, path, status, duration (1.8-INT-018)', async () => {
    const request = createMockRequest('/login');
    await middleware(request);

    // Verify console.log was called
    expect(mockConsoleLog).toHaveBeenCalled();

    // Get the log message
    const logCall = mockConsoleLog.mock.calls[0][0];

    // Verify log contains required fields
    expect(logCall).toContain('GET');
    expect(logCall).toContain('/login');
    expect(logCall).toContain('200'); // Status
    expect(logCall).toMatch(/\d+ms/); // Duration in milliseconds

    // Expected format: [timestamp] METHOD path - STATUS (DURATIONms)
    // Example: [2024-10-05T10:30:45.123Z] GET /login - 200 (5ms)
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 18 tests passing
```

#### Category 9: Edge Cases (Task 12)

**Tests**: 1.8-INT-019 through 1.8-INT-020

```typescript
describe('Edge Cases - Path Matching', () => {
  it('should match /api/auth/logout/extra as public path (startsWith) (1.8-INT-019)', async () => {
    // Public paths use startsWith, so deeper paths should match
    const request = createMockRequest('/api/auth/logout/extra');
    const response = await middleware(request);

    // Should be treated as public path (logout prefix)
    expect(response.status).toBe(200);
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });

  it('should match /login/forgot-password as public path (startsWith) (1.8-INT-020)', async () => {
    const request = createMockRequest('/login/forgot-password');
    const response = await middleware(request);

    // Should be treated as public path (login prefix)
    expect(response.status).toBe(200);
    expect(jwt.verifyToken).not.toHaveBeenCalled();
  });
});
```

**Verification**:

```bash
pnpm test middleware.test.ts
# Expected: 20 tests passing ✅
```

**Expected Final Output**:

```
 ✓ middleware.test.ts (20 tests)
   ✓ Public Paths (No Authentication Required) (4)
   ✓ OPTIONS Request Handling (1)
   ✓ Protected Routes - No Token (3)
   ✓ Protected Routes - Invalid Token (3)
   ✓ Protected Routes - Valid Token (2)
   ✓ CORS Origin Validation (3)
   ✓ Headers and Caching (1)
   ✓ Request Logging (1)
   ✓ Edge Cases - Path Matching (2)

Test Files  1 passed (1)
     Tests  20 passed (20)
      Time  <10s
```

---

### Phase 4: Coverage Verification (Task 13)

**Objective**: Verify middleware.ts coverage reaches 95%+ and tests execute in <10 seconds

#### Step 4.1: Run Coverage Analysis

```bash
# Generate coverage report
pnpm test:coverage

# Expected output for middleware.ts:
# File           | % Stmts | % Branch | % Funcs | % Lines |
# middleware.ts  |   95%+  |   90%+   |  100%   |   95%+  |
```

#### Step 4.2: Review Coverage Report HTML

```bash
# Open coverage report in browser
# Location: coverage/index.html

# Manual review steps:
# 1. Navigate to middleware.ts in the report
# 2. Verify all authentication logic paths are green (covered)
# 3. Verify CORS logic is green
# 4. Verify redirect logic is green
# 5. Document any red (uncovered) lines
```

**Expected Coverage Breakdown**:

```
middleware.ts Coverage:
- Public path checks: ✅ 100% (4 paths tested)
- OPTIONS handling: ✅ 100% (1 test)
- Token extraction: ✅ 100% (tested with/without token)
- Token validation: ✅ 100% (valid/invalid/null)
- Page redirects: ✅ 100% (303 status)
- API 401 responses: ✅ 100% (JSON error)
- CORS logic: ✅ 100% (3 origin scenarios)
- Header setting: ✅ 100% (verified on all responses)
- Logging: ✅ 100% (verified format)
- Edge cases: ✅ 100% (path matching)
```

#### Step 4.3: Performance Verification

```bash
# Run tests with timing
pnpm test middleware.test.ts

# Expected execution time: <10 seconds
# Actual time shown in test output
```

**Performance Checklist**:

- [ ] All 20 tests pass
- [ ] Execution time <10 seconds
- [ ] No database connections (pure logic testing)
- [ ] No network calls (all mocked)

#### Step 4.4: Handle Uncovered Lines (If Any)

If coverage is below 95%, identify uncovered lines:

**Common Uncovered Scenarios**:

1. **Unreachable error paths**: Add `/* istanbul ignore next */` comment
2. **Console.log statements**: Already mocked, can be ignored
3. **Complex conditionals**: Add specific test for branch

**Example**: If a defensive error check is unreachable:

```typescript
// In middleware.ts (if applicable)
if (!response) {
  /* istanbul ignore next */
  throw new Error('Middleware must return a response');
}
```

#### Step 4.5: Coverage Success Validation

**Success Criteria**:

- ✅ middleware.ts coverage: 95%+
- ✅ All 20 tests passing
- ✅ Execution time: <10 seconds
- ✅ No Vite warnings
- ✅ Coverage HTML report reviewed

---

## Code Snippets Reference

### Complete createMockRequest() Helper

```typescript
/**
 * Create a mock NextRequest for testing middleware
 *
 * @param pathname - The request path (e.g., '/dashboard', '/api/users')
 * @param options - Configuration options
 * @param options.method - HTTP method (default: 'GET')
 * @param options.token - Auth token value (sets auth-token cookie via Cookie header)
 * @param options.origin - Origin header value for CORS testing
 * @returns NextRequest instance configured for testing
 *
 * CRITICAL: Use Cookie header for auth token (not NextRequest.cookies)
 * NextRequest.cookies is read-only and cannot be modified via constructor.
 * Cookie header parsing happens automatically by Next.js.
 */
function createMockRequest(
  pathname: string,
  options: {
    method?: string;
    token?: string;
    origin?: string;
  } = {}
): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();

  // Set auth token via Cookie header (read-only cookies workaround)
  if (options.token) {
    headers.set('cookie', `auth-token=${options.token}`);
  }

  // Set Origin header for CORS testing
  if (options.origin) {
    headers.set('origin', options.origin);
  }

  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
  });
}
```

### JWT Mocking Patterns

**Module-Level Mock (Top of File)**:

```typescript
import * as jwt from '@/lib/auth/jwt';

vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));
```

**Per-Test Mock Values**:

```typescript
// Valid token scenario
vi.mocked(jwt.verifyToken).mockReturnValue({
  username: 'teacher',
  id: '1',
});

// Invalid/expired token scenario
vi.mocked(jwt.verifyToken).mockReturnValue(null);
```

**Scoped Mock (In describe block)**:

```typescript
describe('Protected Routes - Invalid Token', () => {
  beforeEach(() => {
    vi.mocked(jwt.verifyToken).mockReturnValue(null);
  });

  // All tests in this block use null return value
});
```

### Console Mocking Setup

**Module-Level Mock**:

```typescript
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
```

**Cleanup in Tests**:

```typescript
describe('Middleware Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear call history between tests
  });

  // Tests here
});
```

**Verification in Logging Test**:

```typescript
it('should log request (1.8-INT-018)', async () => {
  const request = createMockRequest('/login');
  await middleware(request);

  expect(mockConsoleLog).toHaveBeenCalled();
  const logCall = mockConsoleLog.mock.calls[0][0];
  expect(logCall).toContain('GET');
  expect(logCall).toContain('/login');
});
```

### Response Assertion Examples

**Redirect Assertions (Protected Pages)**:

```typescript
expect(response.status).toBe(303); // See Other (redirect)
expect(response.headers.get('location')).toBe('http://localhost:3000/login');
```

**JSON Error Assertions (Protected APIs)**:

```typescript
expect(response.status).toBe(401);
const data = await response.json();
expect(data.error).toBe('UNAUTHORIZED');
expect(data.message).toBe('Authentication required');
```

**Success Assertions (Valid Token)**:

```typescript
expect(response.status).toBe(200); // Indicates NextResponse.next() was called
```

**CORS Header Assertions**:

```typescript
expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
```

**Caching Header Assertions**:

```typescript
expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
```

---

## Common Issues & Solutions

### Issue 1: Cookie Header Approach

**Problem**: Why not use `NextRequest.cookies` API?

**Answer**:

- `NextRequest.cookies` is a read-only `RequestCookies` object
- Cannot be modified via constructor
- Must use `Cookie` header approach for testing
- Matches production behavior (automatic parsing by Next.js)

**Correct Approach**:

```typescript
const headers = new Headers();
headers.set('cookie', `auth-token=${token}`);
const request = new NextRequest(url, { headers });
```

**Incorrect Approach** (won't work):

```typescript
// This FAILS - cookies is read-only
const request = new NextRequest(url);
request.cookies.set('auth-token', token); // ❌ Error
```

### Issue 2: Token Mocking Challenges

**Problem**: Different tests need different `verifyToken` return values

**Solution**: Use nested describe blocks with beforeEach hooks

**Pattern**:

```typescript
describe('Protected Routes - Invalid Token', () => {
  beforeEach(() => {
    vi.mocked(jwt.verifyToken).mockReturnValue(null);
  });

  // All tests here use null return value
});

describe('Protected Routes - Valid Token', () => {
  beforeEach(() => {
    vi.mocked(jwt.verifyToken).mockReturnValue({ username: 'teacher', id: '1' });
  });

  // All tests here use valid payload
});
```

### Issue 3: Console Pollution Prevention

**Problem**: Middleware logs every request, cluttering test output

**Solution**: Mock console.log at module level

**Implementation**:

```typescript
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear call history
  });

  // Tests run silently

  it('should verify logging (1.8-INT-018)', async () => {
    // This test explicitly checks the log call
    expect(mockConsoleLog).toHaveBeenCalled();
  });
});
```

### Issue 4: CORS Pattern Matching

**Problem**: How to test wildcard `*.vercel.app` pattern?

**Solution**: Test with specific subdomain, verify exact match

**Implementation**:

```typescript
it('should allow *.vercel.app domains (1.8-INT-015)', async () => {
  const request = createMockRequest('/api/health', {
    origin: 'https://my-project.vercel.app',
  });
  const response = await middleware(request);

  // Middleware should match *.vercel.app pattern and allow this specific origin
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://my-project.vercel.app');
});
```

**Edge Case**: Missing origin header

```typescript
it('should default to same-origin when no origin header (1.8-INT-016)', async () => {
  const request = createMockRequest('/api/health');
  const response = await middleware(request);

  // Should use request URL origin as fallback
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
});
```

### Issue 5: NextResponse.next() Testing

**Problem**: How to verify middleware allowed request through?

**Solution**: Check response status is 200 (not redirect or error)

**Explanation**:

- `NextResponse.next()` returns a response that continues to the route handler
- In test environment, this manifests as status 200
- Redirect returns 303, API error returns 401
- Status 200 = middleware passed request through successfully

**Implementation**:

```typescript
it('should allow access with valid token (1.8-INT-012)', async () => {
  vi.mocked(jwt.verifyToken).mockReturnValue({ username: 'teacher', id: '1' });

  const request = createMockRequest('/dashboard', { token: 'valid-jwt' });
  const response = await middleware(request);

  // Status 200 indicates NextResponse.next() was called
  expect(response.status).toBe(200);
});
```

---

## Success Validation

### Final Checklist

**Phase 1: Vite CJS Fix**

- [ ] `"type": "module"` added to package.json
- [ ] No CJS warnings when running `pnpm test`
- [ ] No CJS warnings when running `pnpm dev`
- [ ] Changes committed separately

**Phase 2: Test Infrastructure**

- [ ] middleware.test.ts created in project root
- [ ] All imports work correctly
- [ ] createMockRequest() helper implemented
- [ ] JWT module mocked
- [ ] Console.log mocked
- [ ] Empty test suite runs successfully

**Phase 3: Test Scenarios**

- [ ] 4 public path tests passing (1.8-INT-001 to 004)
- [ ] 1 OPTIONS test passing (1.8-INT-005)
- [ ] 3 no-token tests passing (1.8-INT-006 to 008)
- [ ] 3 invalid-token tests passing (1.8-INT-009 to 011)
- [ ] 2 valid-token tests passing (1.8-INT-012 to 013)
- [ ] 3 CORS tests passing (1.8-INT-014 to 016)
- [ ] 1 caching test passing (1.8-INT-017)
- [ ] 1 logging test passing (1.8-INT-018)
- [ ] 2 edge case tests passing (1.8-INT-019 to 020)
- [ ] **Total: 20 tests passing**

**Phase 4: Coverage & Performance**

- [ ] Coverage report generated
- [ ] middleware.ts coverage: 95%+
- [ ] HTML coverage report reviewed
- [ ] No uncovered critical paths
- [ ] Test execution time: <10 seconds
- [ ] All performance criteria met

### Acceptance Criteria Validation

Map final results to acceptance criteria from Story 1.8:

| AC  | Criterion                                   | Validation                              |
| --- | ------------------------------------------- | --------------------------------------- |
| 1   | Middleware test file created with 20 tests  | ✅ middleware.test.ts with 20 scenarios |
| 2   | Public paths tested                         | ✅ Tests 001-004 + edge cases 019-020   |
| 3   | Protected pages redirect to /login with 303 | ✅ Tests 006-007, 009-010               |
| 4   | Protected APIs return 401 JSON              | ✅ Tests 008, 011                       |
| 5   | Valid JWT tokens allow access               | ✅ Tests 012-013                        |
| 6   | Invalid tokens trigger auth failure         | ✅ Tests 009-011                        |
| 7   | OPTIONS return 200 with CORS                | ✅ Test 005                             |
| 8   | CORS origin validation tested               | ✅ Tests 014-016                        |
| 9   | Request logging verified                    | ✅ Test 018                             |
| 10  | x-middleware-cache header set               | ✅ Test 017                             |
| 11  | Package.json updated with type: module      | ✅ Phase 1 complete                     |
| 12  | All tests pass with no Vite warnings        | ✅ Verified in Phase 1                  |
| 13  | Middleware coverage 95%+                    | ✅ Verified in Phase 4                  |
| 14  | Test execution <10 seconds                  | ✅ Verified in Phase 4                  |

### Commit Message Template

Once all tests pass and coverage is verified:

```bash
git add middleware.test.ts
git commit -m "test: Add comprehensive middleware integration tests (20 scenarios)

Implement 20 integration test scenarios covering:
- Public path access (4 tests)
- OPTIONS request handling (1 test)
- Protected route authentication (8 tests: no token, invalid, valid)
- CORS origin validation (3 tests)
- Response headers and caching (1 test)
- Request logging (1 test)
- Edge cases for path matching (2 tests)

Coverage increase: 0% → 95%+ for middleware.ts
All tests execute in <10 seconds

Story: 1.8 (Tasks 2-13)
Tests: 1.8-INT-001 through 1.8-INT-020"
```

---

## Troubleshooting Guide

### Test Failures

**Symptom**: Tests fail with import errors

**Diagnosis**:

```bash
pnpm test middleware.test.ts 2>&1 | grep -i "error"
```

**Solutions**:

1. Verify all imports use correct paths (`@/lib/auth/jwt`)
2. Check vitest config includes middleware.test.ts
3. Verify Next.js types are available

---

**Symptom**: Tests fail with cookie not being read

**Diagnosis**: Check if cookie is set via NextRequest.cookies API

**Solution**: Use Cookie header approach (see Issue 1 above)

---

**Symptom**: verifyToken not being mocked correctly

**Diagnosis**:

```typescript
console.log('Mock implementation:', jwt.verifyToken.toString());
```

**Solutions**:

1. Verify vi.mock is at module level (not inside describe)
2. Check mockReturnValue is called in beforeEach or per test
3. Use `vi.mocked(jwt.verifyToken)` to access mock

---

**Symptom**: CORS tests fail with unexpected Allow-Origin

**Diagnosis**: Check middleware CORS logic for allowed origins

**Solution**: Verify test origin matches allowed patterns:

- `http://localhost:3000`
- `http://localhost:3001`
- `https://*.vercel.app` (regex)

---

### Coverage Issues

**Symptom**: Coverage below 95%

**Diagnosis**:

```bash
pnpm test:coverage
# Review coverage/index.html for uncovered lines
```

**Solutions**:

1. Identify uncovered branches in HTML report
2. Add specific tests for those branches
3. Add `/* istanbul ignore next */` for unreachable code

---

**Symptom**: Coverage report doesn't include middleware.ts

**Diagnosis**: Check vitest.config.ts coverage configuration

**Solution**: Verify `coverage.include` contains `['middleware.ts']`

---

### Performance Issues

**Symptom**: Tests take >10 seconds to execute

**Diagnosis**:

```bash
pnpm test middleware.test.ts --reporter=verbose
```

**Solutions**:

1. Remove unnecessary async/await for sync assertions
2. Check for accidental network calls (should all be mocked)
3. Verify no database connections in test environment
4. Use `vi.clearAllMocks()` instead of `vi.restoreAllMocks()` (faster)

---

## Additional Resources

### Cross-References

**From Story 1.8**:

- `docs/stories/1.8.story.md` - Full story specification
- `docs/qa/assessments/1.8-test-design-20251005.md` - Test design document
- `docs/qa/assessments/1.8-risk-20251005.md` - Risk assessment

**Related Stories**:

- Story 1.5 - Basic Authentication Implementation (JWT module)
- Story 1.7 - Hosting and Production Environment Setup (middleware deployment)

**Testing Standards**:

- `docs/architecture/testing-strategy.md` - Project testing standards
- `lib/auth/jwt.test.ts` - JWT mocking reference patterns

### Middleware Source

**File**: `middleware.ts` (project root)

**Key Functions**:

- `middleware(request: NextRequest)` - Main middleware function
- Public paths array
- CORS configuration
- Authentication logic

**Dependencies**:

- `next/server` - NextRequest, NextResponse
- `@/lib/auth/jwt` - verifyToken function

### Test Execution Commands

```bash
# Run middleware tests only
pnpm test middleware.test.ts

# Run with coverage
pnpm test:coverage middleware.test.ts

# Run in watch mode (during development)
pnpm test -- --watch middleware.test.ts

# Run with verbose output
pnpm test middleware.test.ts --reporter=verbose

# Generate coverage HTML report
pnpm test:coverage && open coverage/index.html
```

---

## Implementation Completion

### Dev Agent Record Template

After implementation, populate this section in `docs/stories/1.8.story.md`:

```markdown
## Dev Agent Record

### Agent Model Used

Claude 3.7 Sonnet (claude-sonnet-4-5-20250929)

### Implementation Duration

[Start time] - [End time] = [Total hours]

### Debug Log References

- `claudedocs/implementation-guides/story-1.8-dev-guide.md` - This guide
- `claudedocs/debug-logs/story-1.8-[timestamp].md` - Detailed debug log (if created)

### Completion Notes

- All 20 tests passing ✅
- Coverage: [X]% (target: 95%+)
- Execution time: [X]s (target: <10s)
- No Vite warnings ✅

### Challenges Encountered

[Document any unexpected issues and solutions]

### File List

Files created:

- middleware.test.ts

Files modified:

- package.json (added "type": "module")
```

---

**END OF IMPLEMENTATION GUIDE**

This guide provides complete, actionable instructions for implementing Story 1.8. Follow phases sequentially, verify each step, and use the troubleshooting section for any issues encountered.
