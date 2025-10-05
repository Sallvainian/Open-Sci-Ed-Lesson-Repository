# Story 1.8: QA Validation Checklist

**Story:** Middleware Integration Tests + Vite CJS Fix
**QA Engineer:** [Your Name]
**QA Date:** [Date]
**Branch:** feature/lesson-repository-mvp
**Story Status:** [Draft/Ready/In QA/Complete]

---

## Pre-QA Setup

- [ ] Pull latest code from feature branch: `git pull origin feature/lesson-repository-mvp`
- [ ] Verify correct branch: `git branch` (should show feature/lesson-repository-mvp)
- [ ] Install dependencies: `pnpm install`
- [ ] Verify development environment ready: `pnpm --version` (should show pnpm version)
- [ ] Check package.json contains `"type": "module"` (AC 11)

**Expected:** Clean environment with all dependencies installed, no errors

---

## Functional Validation

### AC-1: Middleware Test File Exists and Structure

- [ ] File exists: `middleware.test.ts` in project root
- [ ] File contains exactly 20 test scenarios
- [ ] Test IDs 1.8-INT-001 through 1.8-INT-020 present in test descriptions
- [ ] All tests using proper Vitest syntax (describe, it, expect)
- [ ] File imports NextRequest from 'next/server'
- [ ] File imports middleware function from './middleware'
- [ ] File mocks @/lib/auth/jwt module
- [ ] Console.log mocked to prevent test output pollution
- [ ] Helper function createMockRequest() implemented

**Expected:** Well-structured test file with all imports and mocks configured correctly

---

### AC-2: Public Paths Bypass Authentication (4 tests)

**Critical Security Tests - Run First**

#### Test 1.8-INT-001: GET /login bypasses auth

- [ ] Run test individually: `pnpm test -t "1.8-INT-001"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200 (NextResponse.next())
  - verifyToken() NOT called
  - No authentication check performed

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-002: POST /api/auth/login bypasses auth

- [ ] Run test individually: `pnpm test -t "1.8-INT-002"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200
  - verifyToken() NOT called
  - Login endpoint accessible without auth

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-003: POST /api/auth/logout bypasses auth

- [ ] Run test individually: `pnpm test -t "1.8-INT-003"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200
  - verifyToken() NOT called
  - Logout works without authentication

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-004: GET /api/health bypasses auth

- [ ] Run test individually: `pnpm test -t "1.8-INT-004"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200
  - verifyToken() NOT called
  - Health check unauthenticated

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-2 Summary:** [ ] All 4 public path tests passing

---

### AC-3: Protected Pages Redirect (303 Status) (2 tests)

#### Test 1.8-INT-006: GET /dashboard (no cookie) redirects to /login

- [ ] Run test individually: `pnpm test -t "1.8-INT-006"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 303 (See Other redirect)
  - Location header is 'http://localhost:3000/login'
  - No authentication cookie present

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-007: GET / (no cookie) redirects to /login

- [ ] Run test individually: `pnpm test -t "1.8-INT-007"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 303
  - Location header is 'http://localhost:3000/login'
  - Homepage protected correctly

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-3 Summary:** [ ] All 2 protected page redirect tests passing

---

### AC-4: Protected APIs Return 401 JSON (1 test)

#### Test 1.8-INT-008: GET /api/users (no cookie) returns 401 JSON

- [ ] Run test individually: `pnpm test -t "1.8-INT-008"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 401 (Unauthorized)
  - Response body is valid JSON
  - JSON contains: `{ "error": "UNAUTHORIZED", "message": "Authentication required" }`

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-4 Summary:** [ ] Protected API 401 test passing

---

### AC-5: Valid JWT Tokens Allow Access (2 tests)

#### Test 1.8-INT-012: GET /dashboard (valid token) proceeds

- [ ] Run test individually: `pnpm test -t "1.8-INT-012"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - verifyToken() mocked to return `{ username: 'teacher', id: '1' }`
  - Response status is 200 (NextResponse.next())
  - verifyToken() called with token value

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-013: GET /api/users (valid token) proceeds

- [ ] Run test individually: `pnpm test -t "1.8-INT-013"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200
  - verifyToken() called with token
  - API access allowed

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-5 Summary:** [ ] All 2 valid token tests passing

---

### AC-6: Invalid/Expired Tokens Trigger Authentication Failure (3 tests)

#### Test 1.8-INT-009: GET /dashboard (invalid token) redirects to /login

- [ ] Run test individually: `pnpm test -t "1.8-INT-009"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - verifyToken() mocked to return null (invalid token)
  - Response status is 303 (redirect)
  - Location header is 'http://localhost:3000/login'
  - verifyToken() called with token value

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-010: GET / (invalid token) redirects to /login

- [ ] Run test individually: `pnpm test -t "1.8-INT-010"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - verifyToken() returns null
  - Response status is 303
  - Location header is 'http://localhost:3000/login'

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-011: GET /api/users (invalid token) returns 401 JSON

- [ ] Run test individually: `pnpm test -t "1.8-INT-011"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - verifyToken() returns null
  - Response status is 401
  - JSON error: `{ "error": "UNAUTHORIZED", "message": "Authentication required" }`

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-6 Summary:** [ ] All 3 invalid token tests passing

---

### AC-7: OPTIONS Requests Return 200 with CORS Headers (1 test)

#### Test 1.8-INT-005: OPTIONS /api/users returns 200 with CORS headers

- [ ] Run test individually: `pnpm test -t "1.8-INT-005"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Response status is 200
  - Access-Control-Allow-Origin header present
  - Access-Control-Allow-Methods includes: GET, POST, PUT, DELETE
  - Access-Control-Allow-Headers includes: Authorization
  - verifyToken() NOT called (no auth check for OPTIONS)

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-7 Summary:** [ ] OPTIONS request test passing

---

### AC-8: CORS Origin Validation Tested (3 tests)

#### Test 1.8-INT-014: Origin http://localhost:3000 sets matching header

- [ ] Run test individually: `pnpm test -t "1.8-INT-014"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Access-Control-Allow-Origin header is 'http://localhost:3000'
  - Origin matches exactly

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-015: Origin https://\*.vercel.app allowed

- [ ] Run test individually: `pnpm test -t "1.8-INT-015"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Origin 'https://my-project.vercel.app' tested
  - Access-Control-Allow-Origin matches origin
  - Wildcard pattern \*.vercel.app works

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-016: No origin header defaults to same-origin

- [ ] Run test individually: `pnpm test -t "1.8-INT-016"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - No origin header in request
  - Access-Control-Allow-Origin defaults to request URL origin
  - Fallback behavior correct

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-8 Summary:** [ ] All 3 CORS origin tests passing

---

### AC-9: Request Logging Verified (1 test)

#### Test 1.8-INT-018: Request logged with timestamp, method, path, status, duration

- [ ] Run test individually: `pnpm test -t "1.8-INT-018"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - mockConsoleLog called
  - Log contains timestamp (ISO format: YYYY-MM-DDTHH:MM:SS)
  - Log contains method (e.g., GET)
  - Log contains path (e.g., /login)
  - Log contains status code (e.g., 200)
  - Log contains duration (e.g., 5ms)
  - Format: `[timestamp] METHOD path - status (duration)`

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-9 Summary:** [ ] Request logging test passing

---

### AC-10: x-middleware-cache Header Set (1 test)

#### Test 1.8-INT-017: x-middleware-cache: no-cache set on all responses

- [ ] Run test individually: `pnpm test -t "1.8-INT-017"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - x-middleware-cache header present
  - Header value is 'no-cache'
  - Header set regardless of authentication result

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-10 Summary:** [ ] Cache header test passing

---

### Edge Cases: Path Matching (2 tests)

#### Test 1.8-INT-019: /api/auth/logout/extra matches public path (startsWith)

- [ ] Run test individually: `pnpm test -t "1.8-INT-019"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Path /api/auth/logout/extra allowed
  - Response status 200
  - verifyToken() NOT called
  - Substring matching works (startsWith logic)

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

#### Test 1.8-INT-020: /login/forgot-password matches public path (startsWith)

- [ ] Run test individually: `pnpm test -t "1.8-INT-020"`
- [ ] Test passes ✅
- [ ] Expected behavior verified:
  - Path /login/forgot-password allowed
  - Response status 200
  - verifyToken() NOT called
  - Deep paths under /login work

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**Edge Cases Summary:** [ ] All 2 edge case tests passing

---

## Test Execution Validation

### Run All Tests

- [ ] Run full test suite: `pnpm test middleware.test.ts`
- [ ] Expected: All 20 tests passing
- [ ] Actual pass count: **\_\_**/20
- [ ] Execution time: **\_\_** seconds (must be <10 seconds per AC 14)
- [ ] No test failures
- [ ] No test errors
- [ ] No timeout errors

**Command:**

```bash
pnpm test middleware.test.ts
```

**Expected Output:**

```
✓ middleware.test.ts (20)
  ✓ Public Paths (AC2) (4)
    ✓ should allow access to /login without authentication (1.8-INT-001)
    ✓ should allow access to POST /api/auth/login (1.8-INT-002)
    ✓ should allow access to POST /api/auth/logout (1.8-INT-003)
    ✓ should allow access to GET /api/health (1.8-INT-004)
  ...

Test Files  1 passed (1)
Tests  20 passed (20)
Duration  <10s
```

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Execution Time:** **\_\_\_\_** seconds
**Notes:** **********************\_\_\_**********************

---

## Vite Warning Validation (AC-11, AC-12)

### Test Command Validation

- [ ] Run: `pnpm test`
- [ ] Observe console output for Vite warnings
- [ ] Expected: **Zero** "Vite CJS Node API deprecated" warnings
- [ ] Actual warnings count: **\_\_\_\_**

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Warning Output (if any):** **********************\_\_\_**********************

### Dev Command Validation

- [ ] Run: `pnpm dev` (let run for 10 seconds)
- [ ] Observe console output for Vite warnings
- [ ] Expected: **Zero** Vite CJS deprecation warnings
- [ ] Actual warnings count: **\_\_\_\_**
- [ ] Stop dev server: Ctrl+C

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Warning Output (if any):** **********************\_\_\_**********************

### Package.json Verification

- [ ] Open: `package.json`
- [ ] Verify field present: `"type": "module"`
- [ ] Field location: After `"private": true` field
- [ ] No syntax errors in package.json

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

**AC-11/AC-12 Summary:** [ ] Vite CJS fix verified, zero warnings

---

## Coverage Validation (AC-13)

### Generate Coverage Report

- [ ] Run: `pnpm test:coverage`
- [ ] Wait for coverage report generation
- [ ] Coverage report generated successfully
- [ ] Open: `coverage/index.html` in browser

**Command:**

```bash
pnpm test:coverage
```

### Middleware Coverage Analysis

- [ ] Navigate to `middleware.ts` file in coverage report
- [ ] **Line Coverage:** **\_\_**% (must be ≥95%)
- [ ] **Branch Coverage:** **\_\_**% (must be ≥95%)
- [ ] **Function Coverage:** **\_\_**% (must be 100% - only 1 function)
- [ ] **Statement Coverage:** **\_\_**% (must be ≥95%)

**Visual Verification:**

- [ ] All authentication paths highlighted **green** (covered)
- [ ] All CORS logic highlighted **green** (covered)
- [ ] All redirect paths highlighted **green** (covered)
- [ ] Acceptable exclusions only (console.log, unreachable error paths)

**Coverage Metrics:**

```
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
middleware.ts   |   XX.XX |    XX.XX |  100.00 |   XX.XX | (list any uncovered)
```

**Pass/Fail:** [ ] PASS (≥95%) / [ ] FAIL (<95%)
**Actual Coverage:** Line: **\_**%, Branch: **\_**%, Function: **\_**%, Statement: **\_**%
**Uncovered Lines (with justification):** **********************\_\_\_**********************

**AC-13 Summary:** [ ] Coverage target ≥95% achieved

---

## Performance Validation (AC-14)

### Execution Time Measurement

- [ ] Run: `time pnpm test middleware.test.ts`
- [ ] Expected: Total execution time <10 seconds
- [ ] Actual execution time: **\_\_\_** seconds

**Command:**

```bash
time pnpm test middleware.test.ts
```

**Expected Output:**

```
real    0m8.234s   (< 10 seconds)
user    0m15.123s
sys     0m1.456s
```

**Pass/Fail:** [ ] PASS (<10s) / [ ] FAIL (≥10s)
**Actual Time:** **\_\_\_\_** seconds
**Notes (if >10s - investigate slow tests):** **********************\_\_\_**********************

**AC-14 Summary:** [ ] Performance target <10 seconds achieved

---

## Code Quality Validation

### Linting

- [ ] Run: `pnpm lint`
- [ ] Expected: **No linting errors** in middleware.test.ts
- [ ] Actual errors: **\_\_\_\_**
- [ ] All lint rules passing

**Command:**

```bash
pnpm lint
```

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Errors (if any):** **********************\_\_\_**********************

### Type Checking

- [ ] Run: `pnpm type-check`
- [ ] Expected: **No TypeScript errors** in middleware.test.ts
- [ ] Actual errors: **\_\_\_\_**
- [ ] All type definitions correct

**Command:**

```bash
pnpm type-check
```

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Errors (if any):** **********************\_\_\_**********************

**Code Quality Summary:** [ ] All quality checks passing

---

## Manual Code Review

### Test File Quality

- [ ] Test descriptions are clear and descriptive
- [ ] Test IDs (1.8-INT-###) included in all test descriptions
- [ ] Mock patterns match Story 1.8 guidance
- [ ] console.log mocking prevents output pollution
- [ ] createMockRequest() helper function well-implemented
- [ ] beforeEach() clears mocks between tests
- [ ] No unnecessary async/await in synchronous tests
- [ ] Test organization follows describe block structure

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

### Mock Implementation Quality

- [ ] vi.mock('@/lib/auth/jwt') configured correctly
- [ ] verifyToken mock returns correct types (null or { username, id })
- [ ] console.log mock prevents test output pollution
- [ ] Mock state cleared in beforeEach (no test pollution)
- [ ] Mock assertions verify call count and arguments

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

### Assertion Quality

- [ ] All assertions use specific matchers (toBe, toEqual, toContain)
- [ ] No loose matchers (toBeTruthy, toBeFalsy)
- [ ] Both positive and negative cases tested
- [ ] Response status codes verified
- [ ] Response headers verified
- [ ] JSON response bodies verified (where applicable)

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Notes:** **********************\_\_\_**********************

---

## Regression Testing

### Existing Functionality Verification

- [ ] Run full test suite: `pnpm test`
- [ ] Expected: **All existing tests** still passing
- [ ] No regressions introduced by new tests
- [ ] Overall test suite health maintained

**Command:**

```bash
pnpm test
```

**Pass/Fail:** [ ] PASS / [ ] FAIL
**Total Tests:** Passed: **\_**, Failed: **\_**, Total: **\_**
**Notes:** **********************\_\_\_**********************

---

## Final Sign-Off

### Acceptance Criteria Validation Summary

| AC# | Requirement                                  | Status          | Notes |
| --- | -------------------------------------------- | --------------- | ----- |
| 1   | Middleware test file with 20 tests           | [ ] ✅ / [ ] ❌ |       |
| 2   | Public paths bypass authentication (4 tests) | [ ] ✅ / [ ] ❌ |       |
| 3   | Protected pages redirect to /login (2 tests) | [ ] ✅ / [ ] ❌ |       |
| 4   | Protected APIs return 401 JSON (1 test)      | [ ] ✅ / [ ] ❌ |       |
| 5   | Valid tokens allow access (2 tests)          | [ ] ✅ / [ ] ❌ |       |
| 6   | Invalid tokens trigger failure (3 tests)     | [ ] ✅ / [ ] ❌ |       |
| 7   | OPTIONS requests return 200 + CORS (1 test)  | [ ] ✅ / [ ] ❌ |       |
| 8   | CORS origin validation tested (3 tests)      | [ ] ✅ / [ ] ❌ |       |
| 9   | Request logging verified (1 test)            | [ ] ✅ / [ ] ❌ |       |
| 10  | x-middleware-cache header set (1 test)       | [ ] ✅ / [ ] ❌ |       |
| 11  | Package.json "type": "module" added          | [ ] ✅ / [ ] ❌ |       |
| 12  | No Vite warnings during test execution       | [ ] ✅ / [ ] ❌ |       |
| 13  | Coverage ≥95% for middleware.ts              | [ ] ✅ / [ ] ❌ |       |
| 14  | Test execution <10 seconds                   | [ ] ✅ / [ ] ❌ |       |

**Total ACs Passing:** **\_\_**/14

### Quality Gates

- [ ] All 20 tests passing ✅
- [ ] Coverage targets met (≥95%) ✅
- [ ] Performance targets met (<10s) ✅
- [ ] No Vite warnings ✅
- [ ] No linting errors ✅
- [ ] No TypeScript errors ✅
- [ ] Code quality standards met ✅
- [ ] No regressions detected ✅

### Issues Found

**Critical Issues (Blocking):**

1. ***
2. ***

**Major Issues (Should Fix):**

1. ***
2. ***

**Minor Issues (Nice to Have):**

1. ***
2. ***

### QA Status

**Overall QA Result:** [ ] PASS / [ ] FAIL

**Recommendations:**

- ***
- ***
- ***

**Ready for Merge:** [ ] YES / [ ] NO

**QA Sign-Off:** ************\_************ Date: ******\_******

**Notes:**

---

---

---

---

## Appendix: Common Issues and Troubleshooting

### Issue: Tests Failing

**Symptoms:**

- One or more tests showing red X
- Test execution errors

**Investigation Steps:**

1. Run failing test individually: `pnpm test -t "TEST-ID"`
2. Review error message carefully
3. Check mock configuration (verifyToken return value)
4. Verify createMockRequest() parameters
5. Review middleware.ts for logic changes

**Common Fixes:**

- Incorrect mock return value (null vs payload)
- Wrong HTTP status code expected
- Missing or incorrect headers
- Cookie header not set correctly

### Issue: Coverage Below 95%

**Symptoms:**

- Coverage report shows <95% for middleware.ts
- Red/yellow highlights in coverage HTML

**Investigation Steps:**

1. Open coverage/index.html
2. Navigate to middleware.ts
3. Identify uncovered lines (red/yellow)
4. Determine if lines are reachable

**Common Fixes:**

- Add test for uncovered branch
- Add edge case test
- Add `/* istanbul ignore next */` for unreachable code

### Issue: Performance >10 seconds

**Symptoms:**

- Test execution time exceeds 10 seconds
- Slow test feedback

**Investigation Steps:**

1. Run with verbose: `pnpm test middleware.test.ts --reporter=verbose`
2. Identify slow tests
3. Check for unnecessary async/await
4. Verify mock clearing (not restoring)

**Common Fixes:**

- Remove unnecessary async/await
- Use vi.clearAllMocks() instead of vi.restoreAllMocks()
- Reduce mock setup overhead
- Group tests with same mock state

### Issue: Vite Warnings Present

**Symptoms:**

- Console shows "Vite CJS Node API deprecated" warnings
- Warnings during `pnpm test` or `pnpm dev`

**Investigation Steps:**

1. Verify package.json contains `"type": "module"`
2. Check field placement (after "private": true)
3. Verify no JSON syntax errors

**Common Fixes:**

- Add `"type": "module"` to package.json
- Fix JSON syntax errors (trailing commas)
- Restart dev server after changes

---

## Quick Reference Commands

```bash
# Pre-QA Setup
git pull origin feature/lesson-repository-mvp
pnpm install

# Test Execution
pnpm test middleware.test.ts                    # Run middleware tests
pnpm test -t "1.8-INT-001"                      # Run single test
pnpm test                                       # Run all tests

# Coverage
pnpm test:coverage                              # Generate coverage report
# Then open: coverage/index.html

# Performance
time pnpm test middleware.test.ts               # Measure execution time

# Code Quality
pnpm lint                                       # Check linting
pnpm type-check                                 # Check TypeScript

# Vite Warning Check
pnpm test                                       # Check for warnings
pnpm dev                                        # Check dev server warnings
```

---

**Document Version:** 1.0
**Created:** 2025-10-05
**Last Updated:** 2025-10-05
**Created By:** QA Engineer (Claude Code)
