import { NextRequest } from 'next/server';
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
  console.log('Hashing password');
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
  console.log('Comparing passwords');
  try {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto
      .pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512')
      .toString('hex');
    return storedHash === hash;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

export function generateJWT(user: UserJwtPayload): string {
  console.log('Generating JWT for user:', user.id);
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): UserJwtPayload | null {
  try {
    console.log('Verifying JWT token');
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    console.log('JWT verified successfully for user:', decoded.id);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function getJWTFromRequest(request: NextRequest): string | null {
  console.log('Extracting JWT from request');
  
  // First try to get from authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('JWT found in Authorization header');
    return authHeader.substring(7);
  }
  
  // Then try to get from cookies
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    console.log('JWT found in cookies');
    return tokenCookie.value;
  }
  
  console.log('No JWT found in request');
  return null;
}

export function getUserFromRequest(request: NextRequest): UserJwtPayload | null {
  console.log('Getting user from request');
  const token = getJWTFromRequest(request);
  if (!token) {
    console.log('No token found, cannot get user');
    return null;
  }
  
  const user = verifyJWT(token);
  console.log('User from token:', user ? `Found (${user.email})` : 'Not found/invalid');
  return user;
}