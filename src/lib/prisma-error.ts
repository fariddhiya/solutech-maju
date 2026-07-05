import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError, BadRequestError, ApiError } from './errors';

export function handlePrismaError(error: unknown): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : 'field';
        return new ConflictError(`Duplicate value for ${target}`);
      }
      case 'P2003':
        return new BadRequestError('Invalid reference. Related resource not found.');
      case 'P2025':
        return new NotFoundError('Resource not found');
      case 'P2023':
        return new BadRequestError('Invalid identifier format');
      default:
        return new ApiError('Database error', 500);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestError('Invalid data provided');
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError('Unexpected server error', 500);
}
