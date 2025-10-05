# Test Coverage Technical Analysis - Stories 1.8 & 1.9

**Generated**: 2025-10-04
**Context**: Comprehensive technical analysis for improving test coverage from 58.93% to 95%+
**Scope**: middleware.ts (0% → 95%), errorHandler.ts (27.77% → 95%), health/route.ts (68.96% → 100%), Header.tsx (66.66% → 100%)

---

## Executive Summary

**Current State**: 58.93% coverage with critical gaps in authentication middleware and error handling
**Target State**: 95%+ coverage with comprehensive integration and unit tests
**Estimated Effort**: 8-12 hours total development time
**Priority Order**:

1. Middleware (HIGH - security critical)
2. Error Handler (MEDIUM-HIGH - quality critical)
3. Health Endpoint (LOW - quick win)
4. Header Component (MEDIUM - UX critical)

---

## Story 1.8: Middleware Testing (0% → 95%+)

### Current Coverage Analysis

**File**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/middleware.ts`
**Lines**: ~115 total
**Current Coverage**: 0% (no tests)
**Complexity**: HIGH - Authentication, CORS, routing logic

### Middleware Functionality Breakdown

The middleware handles:

1. **Public Path Access** - 4 paths bypass authentication:
   - `/login` - Login page
   - `/api/auth/login` - Login API
   - `/api/auth/logout` - Logout API
   - `/api/health` - Health check

2. **OPTIONS Request Handling** - CORS preflight requests
   - Returns 200 with CORS headers
   - No authentication required

3. **Protected Route Authentication**:
   - **Pages** (no `/api` prefix): Redirect to `/login` with 303 status
   - **API routes** (`/api/*`): Return 401 JSON response
   - **Token validation**: Check cookie presence and verify JWT

4. **CORS Origin Validation**:
   - Allowed origins: `localhost:3000`, `localhost:3001`, `*.vercel.app`
   - Same-origin fallback for missing/invalid origins

5. **Response Headers**:
   - `x-middleware-cache: no-cache` (prevent cookie caching issues)
   - CORS headers on all responses

6. **Request Logging**:
   - Timestamp, method, pathname, status, duration

### Required Test Scenarios (20 total)

#### Public Path Tests (4 scenarios)

1. `GET /login` → Should allow without auth
2. `POST /api/auth/login` → Should allow without auth
3. `POST /api/auth/logout` → Should allow without auth
4. `GET /api/health` → Should allow without auth

#### OPTIONS Request (1 scenario)

5. `OPTIONS /api/users` → Should return 200 with CORS headers, skip auth

#### Protected Routes - No Token (3 scenarios)

6. `GET /dashboard` (no cookie) → Should redirect to `/login` with 303
7. `GET /` (no cookie) → Should redirect to `/login` with 303
8. `GET /api/users` (no cookie) → Should return 401 JSON

#### Protected Routes - Invalid Token (3 scenarios)

9. `GET /dashboard` (invalid token) → Should redirect to `/login` with 303
10. `GET /` (invalid token) → Should redirect to `/login` with 303
11. `GET /api/users` (invalid token) → Should return 401 JSON

#### Protected Routes - Valid Token (2 scenarios)

12. `GET /dashboard` (valid token) → Should proceed with NextResponse.next()
13. `GET /api/users` (valid token) → Should proceed with NextResponse.next()

#### CORS Origin Tests (3 scenarios)

14. Origin: `http://localhost:3000` → Should set Access-Control-Allow-Origin to same
15. Origin: `https://project.vercel.app` → Should allow \*.vercel.app domains
16. No origin header → Should set to request URL origin

#### Headers and Logging (2 scenarios)

17. Any request → Should set `x-middleware-cache: no-cache`
18. Any request → Should log with timestamp, method, path, status, duration

#### Edge Cases (2 scenarios)

19. Path `/api/auth/logout/extra` → Should match public path (startsWith behavior)
20. Path `/login/forgot-password` → Should match public path (startsWith behavior)

### Technical Implementation Guide

#### 1. Test File Location

**Create**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/middleware.test.ts`

#### 2. Required Mocks

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { middleware } from './middleware';
import { NextRequest } from 'next/server';
import * as jwt from '@/lib/auth/jwt';

// Mock JWT verification
vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));

// Mock console.log to prevent test output pollution
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
```

#### 3. NextRequest Helper Function

```typescript
/**
 * Create mock NextRequest for testing
 * @param pathname - Request path (e.g., '/dashboard')
 * @param options - Request options
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

  // Add origin if specified
  if (options.origin) {
    headers.set('origin', options.origin);
  }

  // Add auth token as cookie if specified
  if (options.token) {
    headers.set('cookie', `auth-token=${options.token}`);
  }

  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
  });
}
```

#### 4. Test Structure Pattern

```typescript
describe('Middleware Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Public Paths', () => {
    it('should allow access to /login without authentication (1.8-INT-001)', async () => {
      const request = createMockRequest('/login');
      const response = await middleware(request);

      expect(response.status).toBe(200);
      // Verify it proceeds without auth check
    });
  });

  describe('Protected Routes - No Token', () => {
    it('should redirect page to /login when no token present (1.8-INT-006)', async () => {
      const request = createMockRequest('/dashboard');
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('should return 401 JSON for API route when no token present (1.8-INT-008)', async () => {
      const request = createMockRequest('/api/users');
      const response = await middleware(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('UNAUTHORIZED');
      expect(data.message).toBe('Authentication required');
    });
  });

  describe('Protected Routes - Invalid Token', () => {
    beforeEach(() => {
      // Mock verifyToken to return null (invalid token)
      vi.mocked(jwt.verifyToken).mockReturnValue(null);
    });

    it('should redirect page to /login when token invalid (1.8-INT-009)', async () => {
      const request = createMockRequest('/dashboard', { token: 'invalid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      expect(jwt.verifyToken).toHaveBeenCalledWith('invalid-token');
    });
  });

  describe('Protected Routes - Valid Token', () => {
    beforeEach(() => {
      // Mock verifyToken to return valid payload
      vi.mocked(jwt.verifyToken).mockReturnValue({
        username: 'teacher',
        id: '1',
      });
    });

    it('should proceed with NextResponse.next() for valid token (1.8-INT-012)', async () => {
      const request = createMockRequest('/dashboard', { token: 'valid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(jwt.verifyToken).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('CORS Handling', () => {
    it('should return 200 for OPTIONS requests with CORS headers (1.8-INT-005)', async () => {
      const request = createMockRequest('/api/users', {
        method: 'OPTIONS',
        origin: 'http://localhost:3000',
      });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
    });

    it('should allow vercel.app domains (1.8-INT-015)', async () => {
      const request = createMockRequest('/', {
        origin: 'https://my-project.vercel.app',
        token: 'valid-token',
      });

      vi.mocked(jwt.verifyToken).mockReturnValue({ username: 'teacher', id: '1' });
      const response = await middleware(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://my-project.vercel.app'
      );
    });
  });

  describe('Headers and Caching', () => {
    it('should set x-middleware-cache: no-cache on all responses (1.8-INT-017)', async () => {
      const request = createMockRequest('/login');
      const response = await middleware(request);

      expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
    });
  });

  describe('Request Logging', () => {
    it('should log request details (1.8-INT-018)', async () => {
      const request = createMockRequest('/login');
      await middleware(request);

      expect(mockConsoleLog).toHaveBeenCalled();
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain('GET');
      expect(logCall).toContain('/login');
    });
  });
});
```

### Testing Challenges and Solutions

#### Challenge 1: Cookie Handling in NextRequest

**Problem**: NextRequest.cookies is a RequestCookies object, not accessible via constructor
**Solution**: Set cookies via Cookie header: `headers.set('cookie', 'auth-token=value')`

#### Challenge 2: Mocking verifyToken

**Problem**: Need different return values for valid/invalid token scenarios
**Solution**: Use `vi.mocked(jwt.verifyToken).mockReturnValue()` in each test/beforeEach

#### Challenge 3: Testing Redirects

**Problem**: Verify redirect location and status
**Solution**: Check `response.status === 303` and `response.headers.get('location')`

#### Challenge 4: Console.log Pollution

**Problem**: Middleware logs every request
**Solution**: Mock console.log at module level, restore in afterEach

### Estimated Effort

- **Development**: 4-6 hours
- **Review/Refinement**: 1-2 hours
- **Total**: 5-8 hours

---

## Story 1.9: Error Handler Testing (27.77% → 95%+)

### Current Coverage Analysis

**File**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/lib/api/errorHandler.ts`
**Lines**: ~145 total
**Current Coverage**: 27.77% (only happy path tested)
**Missing Coverage**: Prisma errors, ZodError, custom errors, environment-specific logging

### Error Handler Functionality

The error handler provides:

1. **Prisma Error Classification**:
   - P2002: Unique constraint violation → 400 VALIDATION_ERROR
   - P2025: Record not found → 404 NOT_FOUND
   - Other codes: Database operation failed → 500 INTERNAL_ERROR

2. **Validation Error Handling**:
   - ZodError (name === 'ZodError') → 400 VALIDATION_ERROR

3. **Custom Error Classes**:
   - NotFoundError → 404 NOT_FOUND
   - ValidationError → 400 VALIDATION_ERROR
   - UnauthorizedError → 401 UNAUTHORIZED
   - ForbiddenError → 403 FORBIDDEN

4. **Generic Error Handling**:
   - Development: Include actual error message
   - Production: Generic "An unexpected error occurred"

5. **Environment-Specific Logging**:
   - Development: Log with stack trace
   - Production: Log without stack trace

### Required Test Scenarios (14 total)

#### Prisma Error Tests (3 scenarios)

1. P2002 error → 400 VALIDATION_ERROR with "unique constraint" message
2. P2025 error → 404 NOT_FOUND with "record not found" message
3. Unknown Prisma code → 500 INTERNAL_ERROR with "database operation failed"

#### Validation Error (1 scenario)

4. ZodError → 400 VALIDATION_ERROR with error message preserved

#### Custom Error Classes (4 scenarios)

5. NotFoundError → 404 with code NOT_FOUND
6. ValidationError → 400 with code VALIDATION_ERROR
7. UnauthorizedError → 401 with code UNAUTHORIZED
8. ForbiddenError → 403 with code FORBIDDEN

#### Custom Error Properties (1 scenario)

9. Error with statusCode and code → Use custom values

#### Generic Errors (2 scenarios)

10. Error in development → 500 with actual message
11. Error in production → 500 with generic message

#### Environment Logging (2 scenarios)

12. Development → Log with stack trace
13. Production → Log without stack trace

#### Unknown Errors (1 scenario)

14. Non-Error object → 500 INTERNAL_ERROR with generic message

### Technical Implementation Guide

#### 1. Test File Location

**Create**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/lib/api/errorHandler.test.ts`

#### 2. Required Imports and Mocks

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
```

#### 3. Prisma Error Creation Helpers

```typescript
/**
 * Create Prisma error for testing
 */
function createPrismaError(code: string, message: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code,
    clientVersion: '5.22.0', // Match package.json version
  });
}

/**
 * Create ZodError-like object
 */
function createZodError(message: string): Error {
  const error = new Error(message);
  error.name = 'ZodError';
  return error;
}
```

#### 4. Test Structure Pattern

```typescript
describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Prisma Errors', () => {
    it('should handle P2002 unique constraint violation (1.9-UNIT-001)', async () => {
      const error = createPrismaError('P2002', 'Unique constraint failed');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('VALIDATION_ERROR');
      expect(data.message).toBe('A unique constraint would be violated.');
    });

    it('should handle P2025 record not found (1.9-UNIT-002)', async () => {
      const error = createPrismaError('P2025', 'Record not found');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('NOT_FOUND');
      expect(data.message).toBe('Record not found.');
    });

    it('should handle unknown Prisma error codes (1.9-UNIT-003)', async () => {
      const error = createPrismaError('P9999', 'Unknown database error');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('INTERNAL_ERROR');
      expect(data.message).toBe('Database operation failed.');
    });
  });

  describe('Validation Errors', () => {
    it('should handle ZodError (1.9-UNIT-004)', async () => {
      const error = createZodError('Validation failed: field required');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('VALIDATION_ERROR');
      expect(data.message).toBe('Validation failed: field required');
    });
  });

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
      const error = new UnauthorizedError('Invalid credentials');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('UNAUTHORIZED');
      expect(data.message).toBe('Invalid credentials');
    });

    it('should handle ForbiddenError (1.9-UNIT-008)', async () => {
      const error = new ForbiddenError('Access denied');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('FORBIDDEN');
      expect(data.message).toBe('Access denied');
    });
  });

  describe('Custom Error Properties', () => {
    it('should handle errors with custom statusCode and code (1.9-UNIT-009)', async () => {
      const error = new Error('Custom error') as Error & { statusCode: number; code: string };
      error.statusCode = 418;
      error.code = 'TEAPOT';

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(418);
      expect(data.error).toBe('TEAPOT');
      expect(data.message).toBe('Custom error');
    });
  });

  describe('Generic Errors', () => {
    it('should return actual error message in development (1.9-UNIT-010)', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      const error = new Error('Specific error details');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('INTERNAL_ERROR');
      expect(data.message).toBe('Specific error details');
    });

    it('should return generic message in production (1.9-UNIT-011)', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      const error = new Error('Specific error details');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('INTERNAL_ERROR');
      expect(data.message).toBe('An unexpected error occurred.');
    });
  });

  describe('Environment-Specific Logging', () => {
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

  describe('Unknown Errors', () => {
    it('should handle non-Error objects (1.9-UNIT-014)', async () => {
      const error = 'String error';
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('INTERNAL_ERROR');
      expect(data.message).toBe('An unexpected error occurred.');
    });
  });
});
```

### Testing Challenges and Solutions

#### Challenge 1: Prisma Error Construction

**Problem**: PrismaClientKnownRequestError requires specific constructor signature
**Solution**: Use helper function with code and clientVersion parameters

#### Challenge 2: ZodError Detection

**Problem**: Error detection uses name property, not instanceof
**Solution**: Create Error with `name = 'ZodError'`

#### Challenge 3: Environment Variable Testing

**Problem**: Need to test both development and production behaviors
**Solution**: Use `vi.stubEnv('NODE_ENV', 'development')` and clean up with `vi.unstubAllEnvs()`

#### Challenge 4: Console.error Verification

**Problem**: Need to verify logging calls and content
**Solution**: Mock console.error and check mock.calls

### Estimated Effort

- **Development**: 3-4 hours
- **Review/Refinement**: 1 hour
- **Total**: 4-5 hours

---

## Story 1.9: Health Endpoint Testing (68.96% → 100%)

### Current Coverage Analysis

**File**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/app/api/health/route.ts`
**Lines**: 30 total
**Current Coverage**: 68.96%
**Missing Coverage**: Error path (lines 19-28)

### Current Tests (5 scenarios already passing)

- Returns 200 status
- Returns correct JSON structure
- Returns status "ok"
- Returns valid ISO-8601 timestamp
- Returns recent timestamp

### Required New Test Scenarios (2 total)

1. Database query fails → 503 with status "unhealthy" and error message
2. Non-Error thrown → 503 with "Unknown error" message

### Technical Implementation Guide

#### 1. Test File Location

**Modify**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/app/api/health/route.test.ts`

#### 2. Add Mock for Prisma Client

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
```

#### 3. Add Error Tests

```typescript
describe('GET /api/health - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 503 when database query fails (1.9-INT-001)', async () => {
    // Mock database error
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection refused'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.timestamp).toBeDefined();
    expect(data.error).toBe('Connection refused');
  });

  it('should handle non-Error objects in catch block (1.9-INT-002)', async () => {
    // Mock non-Error object thrown
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce('String error');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.error).toBe('Unknown error');
  });
});
```

### Estimated Effort

- **Development**: 15-30 minutes
- **Review**: 10 minutes
- **Total**: 30-45 minutes

---

## Story 1.9: Header Component Testing (66.66% → 100%)

### Current Coverage Analysis

**File**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/components/layout/Header.tsx`
**Lines**: 46 total
**Current Coverage**: 66.66%
**Missing Coverage**: Error handling (catch block) and finally block

### Required Test Scenarios (6 total)

1. Fetch rejects with network error → console.error called, state reset
2. Fetch returns non-ok response → console.error called, state reset
3. Error occurs → router.push NOT called (stays on page)
4. Finally block executes → isLoggingOut reset to false on error
5. Button disabled during logout → isLoading true
6. Button enabled after error → isLoading false

### Technical Implementation Guide

#### 1. Test File Location

**Create**: `/home/sallvain/dev/personal/Open-Sci-Ed-Lesson-Repository/components/layout/Header.test.tsx`

#### 2. Test Setup

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

// Wrapper for Chakra UI
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider>{children}</ChakraProvider>;
}
```

#### 3. Error Handling Tests

```typescript
describe('Header Component - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should handle fetch network error (1.9-UNIT-015)', async () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const networkError = new Error('Network error');

    global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith('Logout failed:', networkError);
      expect(mockPush).not.toHaveBeenCalled();
    });

    mockConsoleError.mockRestore();
  });

  it('should handle fetch non-ok response (1.9-UNIT-016)', async () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const apiError = new Error('API Error');

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ).mockRejectedValueOnce(apiError) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalled();
    });

    mockConsoleError.mockRestore();
  });

  it('should reset loading state in finally block on error (1.9-UNIT-017)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    // Button should show loading initially
    await waitFor(() => {
      expect(screen.getByText(/logging out/i)).toBeDefined();
    });

    // After error, loading state should be reset
    await waitFor(() => {
      expect(screen.queryByText(/logging out/i)).toBeNull();
      expect(screen.getByRole('button', { name: /logout/i })).toBeDefined();
    });
  });

  it('should not redirect to login on error (1.9-UNIT-018)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;

    render(<Header />, { wrapper: Wrapper });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Loading State Management', () => {
    it('should disable button during logout (1.9-UNIT-019)', async () => {
      let resolvePromise: (value: Response) => void;
      const promise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch = vi.fn(() => promise) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText(/logging out/i)).toBeDefined();
      });

      // Resolve promise to clean up
      resolvePromise!(
        new Response(null, { status: 200 })
      );
    });

    it('should enable button after error (1.9-UNIT-020)', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Error'))) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      // Wait for error and state reset
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /logout/i });
        expect(button).toBeDefined();
        expect(button.getAttribute('data-loading')).toBeNull();
      });
    });
  });
});
```

### Testing Challenges and Solutions

#### Challenge 1: Async State Updates

**Problem**: State changes happen asynchronously
**Solution**: Use `waitFor()` to wait for state updates

#### Challenge 2: Console.error Mocking

**Problem**: Need to verify error logging
**Solution**: Mock console.error, verify calls, restore in test

#### Challenge 3: Button Loading State

**Problem**: Need to verify button states change correctly
**Solution**: Check for loading text and button disabled state

### Estimated Effort

- **Development**: 1-2 hours
- **Review**: 30 minutes
- **Total**: 1.5-2.5 hours

---

## Testing Utilities and Patterns

### Common Vitest Patterns

```typescript
// Environment variable mocking
vi.stubEnv('NODE_ENV', 'production');
vi.unstubAllEnvs(); // Clean up

// Console mocking
const mockConsole = vi.spyOn(console, 'log').mockImplementation(() => {});
mockConsole.mockRestore(); // Clean up

// Function mocking
vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));
vi.mocked(jwt.verifyToken).mockReturnValue({ id: '1', username: 'test' });

// Timer mocking
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

### React Testing Library Patterns

```typescript
// Wrapper for Chakra UI
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}

// Rendering with wrapper
render(<Component />, { wrapper: Wrapper });

// Async assertions
await waitFor(() => {
  expect(screen.getByText('Expected')).toBeDefined();
});

// User interactions
const button = screen.getByRole('button', { name: /click me/i });
fireEvent.click(button);

// Query patterns
screen.getByText('text'); // Throws if not found
screen.queryByText('text'); // Returns null if not found
screen.findByText('text'); // Async, waits for element
```

### Next.js Testing Patterns

```typescript
// NextRequest creation
const request = new NextRequest('http://localhost:3000/path', {
  method: 'GET',
  headers: new Headers({
    cookie: 'auth-token=value',
    origin: 'http://localhost:3000',
  }),
});

// NextResponse assertions
expect(response.status).toBe(200);
expect(response.headers.get('header-name')).toBe('value');
const data = await response.json();
expect(data).toEqual({ key: 'value' });
```

---

## Risk Assessment and Mitigation

### High Risk Areas

1. **Middleware Testing Complexity**
   - Risk: Cookie handling and NextRequest mocking is complex
   - Mitigation: Create helper functions, reference existing API route tests
   - Estimated Impact: May take 1-2 extra hours if issues arise

2. **Environment Variable Pollution**
   - Risk: vi.stubEnv without cleanup affects other tests
   - Mitigation: Always use afterEach(() => vi.unstubAllEnvs())
   - Estimated Impact: Test flakiness if not handled

3. **Prisma Error Construction**
   - Risk: Wrong constructor signature causes test failures
   - Mitigation: Use helper function matching exact Prisma version
   - Estimated Impact: 30-60 min debugging if wrong

### Medium Risk Areas

1. **Async State Management in React**
   - Risk: Tests fail due to timing issues
   - Mitigation: Use waitFor with appropriate timeouts
   - Estimated Impact: Test flakiness

2. **Mock Cleanup**
   - Risk: Mocks leak between tests
   - Mitigation: Consistent beforeEach/afterEach patterns
   - Estimated Impact: Intermittent test failures

### Low Risk Areas

1. **Health Endpoint Testing**
   - Simple error path, low complexity
   - Clear mock requirements

2. **Custom Error Classes**
   - Straightforward instantiation and assertion
   - Well-defined behavior

---

## Coverage Target Validation

### Post-Implementation Verification

```bash
# Run coverage report
pnpm test:coverage

# Expected results:
# middleware.ts: 95%+ (acceptable to miss some logging branches)
# lib/api/errorHandler.ts: 95%+ (all error paths covered)
# app/api/health/route.ts: 100%
# components/layout/Header.tsx: 100%

# Overall coverage: 95%+ (target achieved)
```

### Coverage Exclusions (if needed)

If certain lines are not feasible to test:

```typescript
/* istanbul ignore next */
console.log('Debugging only');
```

**Note**: Avoid coverage exclusions unless absolutely necessary. Most "untestable" code can be tested with proper mocking.

---

## Implementation Priority and Sequencing

### Phase 1: Quick Wins (2-3 hours)

1. **Health Endpoint** (30-45 min) - Easiest, immediate coverage boost
2. **Header Component** (1.5-2.5 hours) - Moderate complexity, clear patterns

### Phase 2: Core Testing (4-6 hours)

3. **Error Handler** (4-5 hours) - Medium-high complexity, many scenarios

### Phase 3: Complex Integration (4-6 hours)

4. **Middleware** (5-8 hours) - Most complex, highest priority for security

**Total Estimated Effort**: 11-17 hours across all stories

### Recommended Approach

- Start with Phase 1 to build momentum and validate testing patterns
- Move to Error Handler to establish error testing patterns
- Finish with Middleware when team is comfortable with Next.js testing

---

## Additional Resources

### Next.js Testing Documentation

- [Testing Next.js Middleware](https://nextjs.org/docs/app/building-your-application/testing/vitest#testing-middleware)
- [Next.js Request/Response APIs](https://nextjs.org/docs/app/api-reference/functions/next-request)

### Vitest Documentation

- [Mocking Guide](https://vitest.dev/guide/mocking.html)
- [Environment Variables](https://vitest.dev/api/vi.html#vi-stubenv)

### Testing Library

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Async Utilities](https://testing-library.com/docs/dom-testing-library/api-async/)

### Prisma Testing

- [Testing Prisma](https://www.prisma.io/docs/guides/testing)
- [Error Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)

---

## Conclusion

This technical analysis provides comprehensive guidance for implementing test coverage improvements in Stories 1.8 and 1.9. Key takeaways:

1. **Middleware testing** is the most complex but critical for security
2. **Error handler testing** requires careful environment and error type mocking
3. **Health endpoint and Header component** are relatively straightforward
4. **Total effort**: 11-17 hours with proper prioritization
5. **Risk areas**: Cookie handling, environment mocking, Prisma errors

With these detailed technical specifications, implementation can proceed systematically with clear test scenarios, mocking strategies, and validation criteria.
