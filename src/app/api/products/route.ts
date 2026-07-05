import { NextRequest } from 'next/server';
import { getProducts } from '@/modules/products/product.service';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';

export async function GET() {
  try {
    const products = await getProducts();
    return success(products);
  } catch (err) {
    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors);
    }

    return error('Internal server error', 500);
  }
}

export async function POST(_request: NextRequest) {
  return error('Product creation will be implemented in next stage', 501);
}
