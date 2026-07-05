import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getAuthUser } from '@/middlewares/auth.middleware';
import {
  getProducts,
  createNewProduct,
} from '@/modules/products/product.service';
import {
  productSchema,
  productQuerySchema,
} from '@/modules/products/product.schema';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError } from '@/lib/validation';
import { handlePrismaError } from '@/lib/prisma-error';

export async function GET(request: NextRequest) {
  try {
    getAuthUser(request);

    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    });

    const result = await getProducts(query);
    return success(result, 'Products retrieved successfully');
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

export async function POST(request: NextRequest) {
  try {
    getAuthUser(request);

    const body = await request.json();
    const parsed = productSchema.parse(body);
    const product = await createNewProduct(parsed);

    return success(product, 'Product created successfully', 201);
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
