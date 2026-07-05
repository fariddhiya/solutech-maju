import { Prisma } from '@prisma/client';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  ApiError,
} from './errors';
import { ERROR_MESSAGES } from '@/constants/error-message.constant';

export function handlePrismaError(error: unknown): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : 'field';
        return new ConflictError(ERROR_MESSAGES.DATABASE.DUPLICATE_VALUE(target));
      }
      case 'P2003':
        return new BadRequestError(ERROR_MESSAGES.DATABASE.INVALID_REFERENCE);
      case 'P2025':
        return new NotFoundError(ERROR_MESSAGES.DATABASE.NOT_FOUND);
      case 'P2023':
        return new BadRequestError(ERROR_MESSAGES.VALIDATION.INVALID_ID);
      default:
        return new ApiError(ERROR_MESSAGES.DATABASE.ERROR, 500);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestError(ERROR_MESSAGES.DATABASE.INVALID_DATA);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError(ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
}
