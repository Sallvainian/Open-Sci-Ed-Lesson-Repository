import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export function handleApiError(error: unknown): NextResponse {
  const apiError = classifyError(error);

  // Log error with stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      error: apiError.error,
      message: apiError.message,
      statusCode: apiError.statusCode,
      originalError: error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  } else {
    // Production: log without stack trace
    console.error('API Error:', {
      error: apiError.error,
      message: apiError.message,
      statusCode: apiError.statusCode,
    });
  }

  return NextResponse.json(
    {
      error: apiError.error,
      message: apiError.message,
    },
    { status: apiError.statusCode }
  );
}

function classifyError(error: unknown): ApiError {
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          error: 'VALIDATION_ERROR',
          message: 'A unique constraint would be violated.',
          statusCode: 400,
        };
      case 'P2025':
        return {
          error: 'NOT_FOUND',
          message: 'Record not found.',
          statusCode: 404,
        };
      default:
        return {
          error: 'INTERNAL_ERROR',
          message: 'Database operation failed.',
          statusCode: 500,
        };
    }
  }

  // Validation errors (Zod, etc.)
  if (error instanceof Error && error.name === 'ZodError') {
    return {
      error: 'VALIDATION_ERROR',
      message: error.message,
      statusCode: 400,
    };
  }

  // Custom application errors
  if (error instanceof Error) {
    // Check for custom error properties
    const customError = error as Error & { statusCode?: number; code?: string };
    if (customError.statusCode && customError.code) {
      return {
        error: customError.code,
        message: error.message,
        statusCode: customError.statusCode,
      };
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      error: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.',
      statusCode: 500,
    };
  }

  // Unknown errors
  return {
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred.',
    statusCode: 500,
  };
}

// Custom error classes for common cases
export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';

  constructor(message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  code = 'UNAUTHORIZED';

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  code = 'FORBIDDEN';

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
