import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { loginSchema } from '@/modules/auth/auth.schema';
import { login } from '@/modules/auth/auth.service';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError } from '@/lib/validation';
import { handlePrismaError } from '@/lib/prisma-error';
import { SUCCESS_MESSAGES } from '@/constants/success-message.constant';
import { createRequestContext } from '@/lib/request-context';
import { logRequest, logRequestError } from '@/lib/logger';
import { applyRateLimit } from '@/middlewares/rate-limit.middleware';

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'login');

    const body = await request.json();
    const parsed = loginSchema.parse(body);
    const result = await login(parsed);

    logRequest(context, 200);

    return success(result, SUCCESS_MESSAGES.AUTH.LOGIN);
  } catch (err) {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    logRequestError(context, err, statusCode);

    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors ?? null);
    }

    if (err instanceof ZodError || err instanceof SyntaxError) {
      const validationError = handleValidationError(err);
      return error(
        validationError.message,
        validationError.statusCode,
        validationError.errors ?? null
      );
    }

    const prismaError = handlePrismaError(err);
    return error(
      prismaError.message,
      prismaError.statusCode,
      prismaError.errors ?? null
    );
  }
}
