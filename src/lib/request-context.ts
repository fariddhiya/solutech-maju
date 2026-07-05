import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export interface RequestContext {
  requestId: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  startTime: number;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export function createRequestContext(request: NextRequest): RequestContext {
  const url = new URL(request.url);

  return {
    requestId: `req_${randomUUID()}`,
    method: request.method,
    path: url.pathname,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    startTime: Date.now(),
  };
}

export function getDurationMs(context: RequestContext): number {
  return Date.now() - context.startTime;
}
