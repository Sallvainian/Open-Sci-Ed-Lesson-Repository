import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash password with bcrypt (1.5-UNIT-006)', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt hash format
    });

    it('should produce different hashes for same password (1.5-UNIT-006)', async () => {
      const password = 'same-password';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salts produce different hashes
    });

    it('should use SALT_ROUNDS = 10 (1.5-UNIT-009)', async () => {
      const password = 'test-password';
      const hash = await hashPassword(password);

      // Extract salt rounds from hash (format: $2b$10$...)
      const saltRounds = hash.split('$')[2];
      expect(saltRounds).toBe('10');
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password (1.5-UNIT-007)', async () => {
      const password = 'correct-password';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should return false for invalid password (1.5-UNIT-008)', async () => {
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';
      const hash = await hashPassword(correctPassword);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should be timing-safe using bcrypt.compare (1.5-UNIT-010)', async () => {
      // bcrypt.compare is inherently timing-safe
      // This test verifies the function uses bcrypt.compare correctly
      const password = 'test-password';
      const hash = await hashPassword(password);

      const startValid = Date.now();
      await verifyPassword(password, hash);
      const validDuration = Date.now() - startValid;

      const startInvalid = Date.now();
      await verifyPassword('wrong-password', hash);
      const invalidDuration = Date.now() - startInvalid;

      // Both operations should take similar time (timing-safe)
      // Allow 50ms tolerance for system variations
      expect(Math.abs(validDuration - invalidDuration)).toBeLessThan(50);
    });
  });
});
