import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface UserJwtPayload {
  id: string;
  email: string;
  name?: string;
}

// Simple password hashing with crypto instead of bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return storedHash === hash;
}

export function generateJWT(user: UserJwtPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): UserJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch (error) {
    return null;
  }
}

export function getJWTFromRequest(request: NextRequest): string | null {
  // First try to get from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Then try to get from cookies
  const tokenCookie = request.cookies.get('token');
  return tokenCookie?.value || null;
}

export function getUserFromRequest(request: NextRequest): UserJwtPayload | null {
  const token = getJWTFromRequest(request);
  if (!token) return null;
  
  return verifyJWT(token);
}