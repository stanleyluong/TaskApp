import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface UserJwtPayload {
  id: string;
  email: string;
  name?: string;
}

// Auth wrapper for API routes without params
export function withAuth(
  handler: (req: NextRequest, user: UserJwtPayload) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      // Get token from cookie
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
      }
      
      // Verify token
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
        // Call the handler with the authenticated user
        return await handler(req, decoded);
      } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
      }
    } catch (error) {
      console.error('Auth wrapper error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// Auth wrapper for dynamic route APIs that need params
export function withAuthParams(
  handler: (req: NextRequest, user: UserJwtPayload, context: any) => Promise<NextResponse>
): (req: NextRequest, context: any) => Promise<NextResponse> {
  return async (req: NextRequest, context: any) => {
    try {
      // Get token from cookie
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
      }
      
      // Verify token
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
        // Call the handler with the authenticated user and params
        return await handler(req, decoded, context);
      } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
      }
    } catch (error) {
      console.error('Auth wrapper error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}