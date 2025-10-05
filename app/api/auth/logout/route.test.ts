import { describe, it, expect } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('Logout API Route', () => {
  it('should clear auth-token cookie (1.5-INT-028)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const setCookieHeader = response.headers.get('set-cookie');

    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toContain('auth-token=');
    // Cookie deletion sets Max-Age=0 or Expires to past date
    expect(setCookieHeader?.includes('Max-Age=0') || setCookieHeader?.includes('Expires=')).toBe(
      true
    );
  });

  it('should return success response (1.5-INT-029)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual({ success: true });
  });

  it('should accept POST method (1.5-INT-030)', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
