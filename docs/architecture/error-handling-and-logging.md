# Error Handling and Logging

## Error Handling Strategy

**Client-Side Error Boundaries**:

```typescript
// components/common/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught error:', error, errorInfo);
    // Future: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**API Error Handler**:

```typescript
// lib/api/errorHandler.ts
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export interface ApiError {
  error: string;
  message: string;
  details?: any;
  statusCode: number;
}

export function handleApiError(error: unknown): ApiError {
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        error: 'CONFLICT',
        message: 'A resource with that identifier already exists',
        statusCode: 409,
      };
    }
    if (error.code === 'P2025') {
      return {
        error: 'NOT_FOUND',
        message: 'The requested resource was not found',
        statusCode: 404,
      };
    }
  }

  // Validation errors
  if (error instanceof ZodError) {
    return {
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.errors,
      statusCode: 422,
    };
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      error: 'INTERNAL_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  // Unknown errors
  return {
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
}
```

## Logging Strategy

**Development Logging**:

```typescript
// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, error?: Error, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, error, ...args);
    // Future: Send to error tracking service
  },
};
```

**API Request Logging**:

```typescript
// middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();

  // Log request
  console.log(`[${request.method}] ${request.url}`);

  const response = NextResponse.next();

  // Log response time
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---
