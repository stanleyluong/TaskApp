import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Check for token cookie existence only
  const hasToken = request.cookies.has('token');
  console.log('Token cookie exists:', hasToken);
  
  if (!hasToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('No token found - redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (hasToken && 
      (request.nextUrl.pathname === '/login' || 
       request.nextUrl.pathname === '/register')) {
    console.log('Auth page access with token - redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Middleware completed, proceeding to next handler');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};