import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ data: { success: true } });

  // Clear authentication cookie
  response.cookies.delete('auth-token');

  return response;
}
