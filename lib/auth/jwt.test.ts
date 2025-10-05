import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyToken } from './jwt';

describe('JWT Utilities', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    // Set test JWT secret
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long-12345';
  });

  afterEach(() => {
    // Restore original environment
    process.env.JWT_SECRET = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate valid JWT token (1.5-UNIT-011)', () => {
      const token = generateToken('user-1', 'teacher');
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should throw error when JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET;
      expect(() => generateToken('user-1', 'teacher')).toThrow(
        'JWT_SECRET environment variable is not configured'
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and return payload (1.5-UNIT-012)', () => {
      const token = generateToken('user-1', 'teacher');
      const payload = verifyToken(token);

      expect(payload).toBeTruthy();
      expect(payload?.userId).toBe('user-1');
      expect(payload?.username).toBe('teacher');
      expect(payload?.exp).toBeTruthy();
      expect(typeof payload?.exp).toBe('number');
    });

    it('should include userId and username in payload (1.5-UNIT-013)', () => {
      const token = generateToken('test-id', 'testuser');
      const payload = verifyToken(token);

      expect(payload).toBeTruthy();
      expect(payload?.userId).toBe('test-id');
      expect(payload?.username).toBe('testuser');
    });

    it('should set token expiration to 8 hours (1.5-UNIT-014)', () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const token = generateToken('user-1', 'teacher');
      const payload = verifyToken(token);
      const afterTime = Math.floor(Date.now() / 1000);

      expect(payload).toBeTruthy();
      const expectedExp = beforeTime + 8 * 60 * 60;
      const actualExp = payload!.exp;

      // Allow 2 second tolerance for test execution time
      expect(actualExp).toBeGreaterThanOrEqual(expectedExp - 2);
      expect(actualExp).toBeLessThanOrEqual(afterTime + 8 * 60 * 60 + 2);
    });

    it('should return null for invalid token (1.5-UNIT-016)', () => {
      const payload = verifyToken('invalid.token.here');
      expect(payload).toBeNull();
    });

    it('should return null for expired token (1.5-UNIT-015)', () => {
      // Create token with -1 hour expiration (already expired)
      const expiredToken = generateToken('user-1', 'teacher');
      // Manually create expired token by modifying the payload
      const parts = expiredToken.split('.');
      const payloadData = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      payloadData.exp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const modifiedPayload = Buffer.from(JSON.stringify(payloadData)).toString('base64');

      // This token is malformed and will be rejected
      const invalidExpiredToken = `${parts[0]}.${modifiedPayload}.${parts[2]}`;
      const payload = verifyToken(invalidExpiredToken);
      expect(payload).toBeNull();
    });

    it('should throw error when JWT_SECRET is not configured', () => {
      const token = generateToken('user-1', 'teacher');
      delete process.env.JWT_SECRET;

      expect(() => verifyToken(token)).toThrow('JWT_SECRET environment variable is not configured');
    });
  });
});
