import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import * as jwt from '@/lib/auth/jwt';

// Mock the JWT module
vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));

// Mock console.log to prevent test output pollution
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

/**
 * Helper function to create mock NextRequest instances
 * @param pathname - The request pathname
 * @param options - Optional configuration (method, token, origin)
 * @returns Properly constructed NextRequest for testing
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

  // Set auth token via Cookie header (NextRequest.cookies is read-only)
  if (options.token) {
    headers.set('cookie', `auth-token=${options.token}`);
  }

  if (options.origin) {
    headers.set('origin', options.origin);
  }

  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
  });
}

describe('Middleware Integration Tests', () => {
  beforeEach(() => {
    // Clear all mock call history between tests
    vi.clearAllMocks();
  });

  describe('Public Paths', () => {
    it('should allow access to /login without authentication (1.8-INT-001)', async () => {
      const request = createMockRequest('/login');
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });

    it('should allow access to /api/auth/login without authentication (1.8-INT-002)', async () => {
      const request = createMockRequest('/api/auth/login', { method: 'POST' });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });

    it('should allow access to /api/auth/logout without authentication (1.8-INT-003)', async () => {
      const request = createMockRequest('/api/auth/logout', { method: 'POST' });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });

    it('should allow access to /api/health without authentication (1.8-INT-004)', async () => {
      const request = createMockRequest('/api/health');
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });
  });

  describe('OPTIONS Request Handling', () => {
    it('should return 200 with CORS headers for OPTIONS request (1.8-INT-005)', async () => {
      const request = createMockRequest('/api/users', {
        method: 'OPTIONS',
        origin: 'http://localhost:3000',
      });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('PUT');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('DELETE');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });
  });

  describe('Protected Routes - No Token', () => {
    it('should redirect /dashboard to /login with 303 when no token present (1.8-INT-006)', async () => {
      const request = createMockRequest('/dashboard');
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
    });

    it('should redirect / to /login with 303 when no token present (1.8-INT-007)', async () => {
      const request = createMockRequest('/');
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
    });

    it('should return 401 JSON for /api/users when no token present (1.8-INT-008)', async () => {
      const request = createMockRequest('/api/users');
      const response = await middleware(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('UNAUTHORIZED');
      expect(data.message).toBe('Authentication required');
    });
  });

  describe('Protected Routes - Invalid Token', () => {
    beforeEach(() => {
      // Mock verifyToken to return null (invalid token scenario)
      vi.mocked(jwt.verifyToken).mockReturnValue(null);
    });

    it('should redirect /dashboard to /login with 303 when token is invalid (1.8-INT-009)', async () => {
      const request = createMockRequest('/dashboard', { token: 'invalid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
      expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith('invalid-token');
    });

    it('should redirect / to /login with 303 when token is invalid (1.8-INT-010)', async () => {
      const request = createMockRequest('/', { token: 'invalid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(303);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
      expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith('invalid-token');
    });

    it('should return 401 JSON for /api/users when token is invalid (1.8-INT-011)', async () => {
      const request = createMockRequest('/api/users', { token: 'invalid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('UNAUTHORIZED');
      expect(data.message).toBe('Invalid or expired token');
      expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith('invalid-token');
    });
  });

  describe('Protected Routes - Valid Token', () => {
    beforeEach(() => {
      // Mock verifyToken to return valid payload
      vi.mocked(jwt.verifyToken).mockReturnValue({
        userId: '1',
        username: 'teacher',
        exp: Date.now() / 1000 + 3600, // 1 hour from now
      });
    });

    it('should proceed with NextResponse.next() for /dashboard with valid token (1.8-INT-012)', async () => {
      const request = createMockRequest('/dashboard', { token: 'valid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith('valid-token');
    });

    it('should proceed with NextResponse.next() for /api/users with valid token (1.8-INT-013)', async () => {
      const request = createMockRequest('/api/users', { token: 'valid-token' });
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('CORS Origin Validation', () => {
    beforeEach(() => {
      // Mock valid token for CORS tests
      vi.mocked(jwt.verifyToken).mockReturnValue({
        userId: '1',
        username: 'teacher',
        exp: Date.now() / 1000 + 3600,
      });
    });

    it('should set matching Allow-Origin for localhost:3000 origin (1.8-INT-014)', async () => {
      const request = createMockRequest('/api/users', {
        token: 'valid-token',
        origin: 'http://localhost:3000',
      });
      const response = await middleware(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should allow *.vercel.app domains (1.8-INT-015)', async () => {
      const request = createMockRequest('/api/users', {
        token: 'valid-token',
        origin: 'https://my-project.vercel.app',
      });
      const response = await middleware(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://my-project.vercel.app'
      );
    });

    it('should default to same-origin when no origin header present (1.8-INT-016)', async () => {
      const request = createMockRequest('/api/users', { token: 'valid-token' });
      const response = await middleware(request);

      // Should default to request URL origin
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });
  });

  describe('Headers and Caching', () => {
    it('should set x-middleware-cache: no-cache on all responses (1.8-INT-017)', async () => {
      const requests = [
        createMockRequest('/login'), // Public path
        createMockRequest('/dashboard'), // Protected, no token (redirect)
        createMockRequest('/api/users', { token: 'valid-token' }), // Protected, valid token
      ];

      // Mock valid token for the last request
      vi.mocked(jwt.verifyToken).mockReturnValue({
        userId: '1',
        username: 'teacher',
        exp: Date.now() / 1000 + 3600,
      });

      for (const request of requests) {
        const response = await middleware(request);
        expect(response.headers.get('x-middleware-cache')).toBe('no-cache');
      }
    });
  });

  describe('Request Logging', () => {
    it('should log request with timestamp, method, path, status, duration (1.8-INT-018)', async () => {
      vi.mocked(jwt.verifyToken).mockReturnValue({
        userId: '1',
        username: 'teacher',
        exp: Date.now() / 1000 + 3600,
      });

      const request = createMockRequest('/api/users', { token: 'valid-token' });
      await middleware(request);

      expect(mockConsoleLog).toHaveBeenCalled();
      const logCall = mockConsoleLog.mock.calls[mockConsoleLog.mock.calls.length - 1][0];

      // Verify log contains required fields
      expect(logCall).toContain('GET');
      expect(logCall).toContain('/api/users');
      expect(logCall).toContain('200');
      expect(logCall).toMatch(/\d+ms/); // Duration in milliseconds
      expect(logCall).toMatch(/\d{4}-\d{2}-\d{2}/); // ISO timestamp date portion
    });
  });

  describe('Edge Cases - Path Matching', () => {
    it('should match /api/auth/logout/extra as public path (startsWith) (1.8-INT-019)', async () => {
      const request = createMockRequest('/api/auth/logout/extra');
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });

    it('should match /login/forgot-password as public path (startsWith) (1.8-INT-020)', async () => {
      const request = createMockRequest('/login/forgot-password');
      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(vi.mocked(jwt.verifyToken)).not.toHaveBeenCalled();
    });
  });
});
