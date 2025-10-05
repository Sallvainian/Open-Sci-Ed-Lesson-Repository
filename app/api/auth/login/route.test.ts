import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { MVP_USER } from '@/lib/auth/constants';

describe('Login API Route', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long-12345';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  it('should return 200 for valid credentials (1.5-INT-003, 1.5-INT-034)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeDefined();
    expect(data.data.token).toBeTruthy();
    expect(data.data.user).toEqual({
      id: MVP_USER.id,
      username: MVP_USER.username,
    });
  });

  it('should return 401 for invalid username (1.5-INT-004, 1.5-INT-035)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'invalid-user',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('INVALID_CREDENTIALS');
    expect(data.message).toBe('Invalid username or password');
  });

  it('should return 401 for invalid password (1.5-INT-036)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'wrong-password',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('INVALID_CREDENTIALS');
    expect(data.message).toBe('Invalid username or password');
  });

  it('should return identical error for invalid username and password (1.5-INT-037)', async () => {
    const requestInvalidUsername = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'invalid-user',
        password: 'password123',
      }),
    });

    const requestInvalidPassword = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'wrong-password',
      }),
    });

    const response1 = await POST(requestInvalidUsername);
    const data1 = await response1.json();

    const response2 = await POST(requestInvalidPassword);
    const data2 = await response2.json();

    expect(response1.status).toBe(response2.status);
    expect(data1.error).toBe(data2.error);
    expect(data1.message).toBe(data2.message);
    expect(data1.message).toBe('Invalid username or password');
  });

  it('should block SQL injection attempts in username (1.5-INT-040)', async () => {
    const sqlInjectionAttempts = ["admin' OR '1'='1", "'; DROP TABLE users; --", "admin'--"];

    for (const payload of sqlInjectionAttempts) {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: payload,
          password: 'password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should return 401 (invalid credentials), not allow injection
      expect(response.status).toBe(401);
      expect(data.error).toBe('INVALID_CREDENTIALS');
    }
  });

  it('should sanitize XSS payloads in username (1.5-INT-041)', async () => {
    const xssPayloads = ['<script>alert("XSS")</script>', '<img src=x onerror=alert("XSS")>'];

    for (const payload of xssPayloads) {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: payload,
          password: 'password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should return 401 (invalid credentials), payload rejected
      expect(response.status).toBe(401);
      expect(data.error).toBe('INVALID_CREDENTIALS');
    }
  });

  it('should set httpOnly cookie (1.5-INT-012)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const setCookieHeader = response.headers.get('set-cookie');

    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toContain('auth-token=');
    expect(setCookieHeader).toContain('HttpOnly');
  });

  it('should set cookie with sameSite=lax (1.5-INT-014)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const setCookieHeader = response.headers.get('set-cookie');

    // SameSite is lowercase in the actual cookie header
    expect(setCookieHeader).toContain('SameSite=lax');
  });

  it('should set cookie maxAge to 8 hours (1.5-INT-015)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const setCookieHeader = response.headers.get('set-cookie');

    const maxAge = 8 * 60 * 60; // 8 hours in seconds
    expect(setCookieHeader).toContain(`Max-Age=${maxAge}`);
  });

  it('should set cookie path to / (1.5-INT-016)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: MVP_USER.username,
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const setCookieHeader = response.headers.get('set-cookie');

    expect(setCookieHeader).toContain('Path=/');
  });
});
