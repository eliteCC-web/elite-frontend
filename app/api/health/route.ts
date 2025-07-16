import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol;
  const host = request.headers.get('host') || url.host;
  
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'elite-frontend',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3000',
      protocol: protocol,
      host: host,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://elite-frontend-production.up.railway.app',
      ssl: protocol === 'https'
    },
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  );
} 