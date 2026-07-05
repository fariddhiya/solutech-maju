import { NextRequest } from 'next/server';
import { getProductById } from '@/modules/products/product.service';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return error('Product not found', 404);
    }

    return success(product);
  } catch (err) {
    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors);
    }

    return error('Internal server error', 500);
  }
}

export async function PUT(_request: NextRequest) {
  return error('Product update will be implemented in next stage', 501);
}

export async function DELETE(_request: NextRequest) {
  return error('Product deletion will be implemented in next stage', 501);
}
