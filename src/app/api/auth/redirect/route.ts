import { NextRequest, NextResponse } from 'next/server';

// Set this route as static for static export compatibility
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get('to') || '/dashboard';
  
  // Create redirect response with a 302 status
  return NextResponse.redirect(new URL(destination, request.url), 302);
}