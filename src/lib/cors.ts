import { NextRequest, NextResponse } from 'next/server';

export function withCORS(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
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

    const response = await handler(req, ...args);

    response.headers.set('Access-Control-Allow-Origin', 'https://taskapp.stanleyluong.com');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  };
} 