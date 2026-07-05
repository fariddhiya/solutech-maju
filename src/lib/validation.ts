import { ZodError } from 'zod';
import { BadRequestError } from './errors';

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
    return new BadRequestError('Validation error', formatZodError(error));
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Invalid request');
}
