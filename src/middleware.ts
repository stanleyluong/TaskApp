import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './lib/auth/utils';

export function middleware(request: NextRequest) {
  console.log('Middleware triggered for path:', request.nextUrl.pathname);
  
  const user = getUserFromRequest(request);
  console.log('User from request:', user ? 'authenticated' : 'not authenticated');
  
  // Protect API routes in the /api/tasks path
  if (request.nextUrl.pathname.startsWith('/api/tasks')) {
    if (!user) {
      console.log('API route access denied - unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      console.log('Dashboard access denied - redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('Dashboard access granted');
  }
  
  // Redirect logged in users away from auth pages
  if (
    user && 
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')
  ) {
    console.log('Auth page access while logged in - redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/tasks/:path*', '/dashboard/:path*', '/login', '/register'],
};