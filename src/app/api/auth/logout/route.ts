import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Logging user out');
  
  // Create response to clear the token cookie and redirect to login page
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // Clear the token cookie
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}