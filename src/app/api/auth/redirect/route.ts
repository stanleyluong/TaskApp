import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get('to') || '/dashboard';
  
  // Create redirect response
  const response = NextResponse.redirect(new URL(destination, request.url));
  
  return response;
}