import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { loginSchema } from '@/modules/auth/auth.schema';
import { login } from '@/modules/auth/auth.service';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError } from '@/lib/validation';
import { handlePrismaError } from '@/lib/prisma-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);
    const result = await login(parsed);

    return success(result, 'Login successful');
  } catch (err) {
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
