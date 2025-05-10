import { withCORS } from '@/lib/cors';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withCORS(async (request: NextRequest) => {
  console.log('Logging user out');
  
  // Get the base URL
  const baseUrl = new URL('/', request.url).origin;
  
  // Create response to clear the token cookie and redirect to login page
  const response = NextResponse.redirect(`${baseUrl}/login`);
  
  // Clear the token cookie
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
  });
  
  return response;
});

// Need to handle GET requests for form-based logout attempts
export async function GET(request: NextRequest) {
  console.log('Handling GET request to logout route');
  
  // Get the base URL
  const baseUrl = new URL('/', request.url).origin;
  
  // Create response to clear the token cookie and redirect to login page
  const response = NextResponse.redirect(`${baseUrl}/login`);
  
  // Clear the token cookie
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}