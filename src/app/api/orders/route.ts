import { NextRequest } from 'next/server';
import { getAuthUser } from '@/middlewares/auth.middleware';
import { createOrder } from '@/modules/orders/order.service';
import { orderSchema } from '@/modules/orders/order.schema';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const parsed = orderSchema.parse(body);
    const result = await createOrder(user.userId, parsed);

    return success(result, 'Order accepted', 202);
  } catch (err) {
    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors);
    }

    if (err instanceof Error) {
      return error(err.message, 400);
    }

    return error('Internal server error', 500);
  }
}
