import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/schemas';
import { verifyPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { MVP_USER } from '@/lib/auth/constants';
import { handleApiError } from '@/lib/api/errorHandler';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // Verify credentials against hardcoded user
    if (username !== MVP_USER.username) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, MVP_USER.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token with 8-hour expiration
    const token = generateToken(MVP_USER.id, MVP_USER.username);

    // Set httpOnly cookie for secure storage
    const response = NextResponse.json({
      data: {
        token,
        user: { id: MVP_USER.id, username: MVP_USER.username },
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}
