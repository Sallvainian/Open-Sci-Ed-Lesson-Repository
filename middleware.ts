import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const startTime = Date.now();

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
  matcher: '/api/:path*',
};
