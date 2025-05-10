import { comparePasswords, generateJWT } from '@/lib/auth/utils';
import { withCORS } from '@/lib/cors';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withCORS(async (request: NextRequest) => {
  console.log('Login API route called');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Received login request for email:', body.email);
    } catch (e) {
      console.error('Error parsing JSON body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Looking up user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password for user:', user.id);
    const passwordMatch = await comparePasswords(password, user.password);
    console.log('Password match result:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password mismatch for user:', user.id);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    console.log('Generating JWT for user:', user.id);
    const token = generateJWT({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    });

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      success: true
    });

    // Set cookie
    console.log('Setting auth cookie for user:', user.id);
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('Login successful for user:', user.id);
    console.log('Cookies in response:', response.cookies);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
});

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://taskapp.stanleyluong.com',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}