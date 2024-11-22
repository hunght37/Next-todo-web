import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRedisClient } from '@/lib/redis';

const redis = getRedisClient();

export async function middleware(request: NextRequest) {
  // Only cache GET requests
  if (request.method !== 'GET') {
    return NextResponse.next();
  }

  const cacheKey = request.url;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return new NextResponse(cachedData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
      },
    });
  }

  const response = await NextResponse.next();

  // Only cache successful responses
  if (response.status === 200) {
    const data = await response.text();
    await redis.set(cacheKey, data, 'EX', 60); // Cache for 60 seconds
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });
  }

  return response;
}
