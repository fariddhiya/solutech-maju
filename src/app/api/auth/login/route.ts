import { NextRequest } from 'next/server';
import { loginSchema } from '@/modules/auth/auth.schema';
import { login } from '@/modules/auth/auth.service';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { ZodError } from 'zod';

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

    if (err instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      err.issues.forEach((issue) => {
        const key = issue.path.join('.');
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      });
      return error('Validation error', 400, errors);
    }

    if (err instanceof Error) {
      return error(err.message, 400);
    }

    return error('Internal server error', 500);
  }
}
