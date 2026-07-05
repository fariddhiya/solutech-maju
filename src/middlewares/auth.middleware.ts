import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { AuthUser } from '@/types/auth';
import { UnauthorizedError } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/constants/error-message.constant';

export function getAuthUser(request: NextRequest): AuthUser {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.TOKEN_MISSING);
  }

  const token = authHeader.split(' ')[1];

  try {
    return verifyToken(token);
  } catch {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.TOKEN_INVALID);
  }
}
