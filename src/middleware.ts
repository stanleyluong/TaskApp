import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Check for token cookie existence only
  const hasToken = request.cookies.has('token');
  console.log('Token cookie exists:', hasToken);
  
  // Only handle specific auth redirects, nothing else
  const basePath = '/TaskApp';
  
  if (!hasToken && request.nextUrl.pathname.startsWith(`${basePath}/dashboard`)) {
    console.log('No token found - redirecting to login');
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }
  
  if (hasToken && 
      (request.nextUrl.pathname === `${basePath}/login` || 
       request.nextUrl.pathname === `${basePath}/register`)) {
    console.log('Auth page access with token - redirecting to dashboard');
    return NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url));
  }

  console.log('Middleware completed, proceeding to next handler');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/TaskApp/dashboard',
    '/TaskApp/dashboard/:path*', 
    '/TaskApp/login', 
    '/TaskApp/register'
  ],
};