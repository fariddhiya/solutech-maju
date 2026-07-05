import { ZodError, z } from 'zod';
import { BadRequestError } from './errors';
import { ERROR_MESSAGES } from '@/constants/error-message.constant';

const uuidSchema = z.string().uuid(ERROR_MESSAGES.VALIDATION.INVALID_ID);

export function formatZodError(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const key = issue.path.join('.') || 'root';
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  });

  return errors;
}

export function handleValidationError(error: unknown): BadRequestError {
  if (error instanceof ZodError) {
    return new BadRequestError(
      ERROR_MESSAGES.VALIDATION.VALIDATION_ERROR,
      formatZodError(error)
    );
  }

  if (error instanceof SyntaxError) {
    return new BadRequestError(ERROR_MESSAGES.VALIDATION.INVALID_JSON);
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError(ERROR_MESSAGES.VALIDATION.INVALID_REQUEST);
}

export function validateId(id: string): void {
  const result = uuidSchema.safeParse(id);

  if (!result.success) {
    throw new BadRequestError(
      ERROR_MESSAGES.VALIDATION.INVALID_ID,
      formatZodError(result.error)
    );
  }
}
