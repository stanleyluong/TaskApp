import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Check for token cookie existence only
  const hasToken = request.cookies.has('token');
  console.log('Token cookie exists:', hasToken);
  
  // Get the base path dynamically from the request URL
  const url = new URL(request.url);
  const basePath = url.pathname.startsWith('/TaskApp') ? '/TaskApp' : '';
  
  if (!hasToken && request.nextUrl.pathname.includes('/dashboard')) {
    console.log('No token found - redirecting to login');
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }
  
  if (hasToken && 
      (request.nextUrl.pathname.endsWith('/login') || 
       request.nextUrl.pathname.endsWith('/register'))) {
    console.log('Auth page access with token - redirecting to dashboard');
    return NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url));
  }

  console.log('Middleware completed, proceeding to next handler');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*', 
    '/login', 
    '/register',
    '/TaskApp/dashboard',
    '/TaskApp/dashboard/:path*', 
    '/TaskApp/login', 
    '/TaskApp/register'
  ],
};