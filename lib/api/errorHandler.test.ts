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

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Prisma Errors', () => {
    /**
     * Helper function to create Prisma errors with correct constructor signature
     * @param code - Prisma error code (e.g., 'P2002', 'P2025')
     * @param message - Error message
     * @returns PrismaClientKnownRequestError instance
     */
    function createPrismaError(
      code: string,
      message: string
    ): Prisma.PrismaClientKnownRequestError {
      return new Prisma.PrismaClientKnownRequestError(message, {
        code,
        clientVersion: '5.22.0', // MUST match package.json @prisma/client version
      });
    }

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
    });

    it('should handle P2025 record not found (1.9-UNIT-002)', async () => {
      const error = createPrismaError(
        'P2025',
        'An operation failed because it depends on one or more records that were required but not found'
      );
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

  describe('Validation Errors', () => {
    /**
     * Helper function to create ZodError-like errors
     * @param message - Error message
     * @returns Error with name property set to 'ZodError'
     */
    function createZodError(message: string): Error {
      const error = new Error(message);
      error.name = 'ZodError'; // CRITICAL: Set name property for detection
      return error;
    }

    it('should handle ZodError (1.9-UNIT-004)', async () => {
      const error = createZodError('Validation failed: email is required');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('VALIDATION_ERROR');
      expect(data.message).toBe('Validation failed: email is required');
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
      const error = new UnauthorizedError('Token expired');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('UNAUTHORIZED');
      expect(data.message).toBe('Token expired');
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
      const error = new Error('Rate limit exceeded') as Error & {
        statusCode?: number;
        code?: string;
      };
      error.statusCode = 429;
      error.code = 'RATE_LIMIT_EXCEEDED';

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('RATE_LIMIT_EXCEEDED');
      expect(data.message).toBe('Rate limit exceeded');
    });
  });

  describe('Environment-Specific Behavior', () => {
    it('should return actual error message in development (1.9-UNIT-010)', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      const error = new Error('Specific database error details');
      const response = handleApiError(error);
      const data = await response.json();

      expect(data.message).toBe('Specific database error details');
    });

    it('should return generic error message in production (1.9-UNIT-011)', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      const error = new Error('Specific database error details');
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

  describe('Edge Cases', () => {
    it('should handle non-Error object (string) (1.9-UNIT-014)', async () => {
      const error = 'Simple string error';
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('INTERNAL_ERROR');
      expect(data.message).toBe('An unexpected error occurred.');
    });
  });
});
