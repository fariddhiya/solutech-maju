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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    getAuthUser(request);
    const { id } = await params;
    validateId(id);

    const product = await getProductById(id);
    return success(product, 'Product retrieved successfully');
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    getAuthUser(request);

    const { id } = await params;
    validateId(id);

    const body = await request.json();
    const parsed = productUpdateSchema.parse(body);
    const product = await updateExistingProduct(id, parsed);

    return success(product, 'Product updated successfully');
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    getAuthUser(request);

    const { id } = await params;
    validateId(id);
    await removeProduct(id);

    return success(null, 'Product deleted successfully');
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
