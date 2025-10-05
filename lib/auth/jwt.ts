import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  username: string;
  exp: number;
}

/**
 * Generates a JWT token with 8-hour expiration
 * @param userId - Unique user identifier
 * @param username - Username
 * @returns Signed JWT token string
 */
export function generateToken(userId: string, username: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  const token = jwt.sign({ userId, username }, secret, { expiresIn: '8h' });
  return token;
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded payload if valid, null if invalid or expired
 */
export function verifyToken(token: string): JwtPayload | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}
