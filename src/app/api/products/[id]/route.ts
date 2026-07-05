import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getAuthUser } from '@/middlewares/auth.middleware';
import {
  getProductById,
  updateExistingProduct,
  removeProduct,
} from '@/modules/products/product.service';
import { productUpdateSchema } from '@/modules/products/product.schema';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError, validateId } from '@/lib/validation';
import { handlePrismaError } from '@/lib/prisma-error';
import { SUCCESS_MESSAGES } from '@/constants/success-message.constant';
import { createRequestContext } from '@/lib/request-context';
import { logRequest, logRequestError } from '@/lib/logger';
import { applyRateLimit } from '@/middlewares/rate-limit.middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'api');
    getAuthUser(request);
    const { id } = await params;
    validateId(id);

    const product = await getProductById(id);

    logRequest(context, 200);
    return success(product, SUCCESS_MESSAGES.PRODUCT.DETAIL_FETCHED);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'api');
    getAuthUser(request);

    const { id } = await params;
    validateId(id);

    const body = await request.json();
    const parsed = productUpdateSchema.parse(body);
    const product = await updateExistingProduct(id, parsed);

    logRequest(context, 200);
    return success(product, SUCCESS_MESSAGES.PRODUCT.UPDATED);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'api');
    getAuthUser(request);

    const { id } = await params;
    validateId(id);
    await removeProduct(id);

    logRequest(context, 200);
    return success(null, SUCCESS_MESSAGES.PRODUCT.DELETED);
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
