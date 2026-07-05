import { NextRequest } from 'next/server';
import { verifyToken, JwtPayload } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/errors';

export function getAuthUser(request: NextRequest): JwtPayload {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(' ')[1];

  try {
    return verifyToken(token);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
