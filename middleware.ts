import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export function middleware(request: NextRequest): NextResponse {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout', '/api/health'];

  // Allow access to public paths
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': getAllowedOrigin(request),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Authentication check for protected routes
  if (!isPublicPath) {
    // Check for authentication token in cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // API routes return 401, pages redirect to login
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'UNAUTHORIZED', message: 'Authentication required' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify token validity
    const payload = verifyToken(token);
    if (!payload) {
      // API routes return 401, pages redirect to login
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'UNAUTHORIZED', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue with the request
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', getAllowedOrigin(request));
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Log request
  const duration = Date.now() - startTime;
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(
    `[${timestamp}] ${request.method} ${request.nextUrl.pathname} -> ${response.status} (${duration}ms)`
  );

  return response;
}

function getAllowedOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }

  // Default to first allowed origin for development
  return allowedOrigins[0];
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs', // jsonwebtoken requires Node.js runtime, not Edge
};
