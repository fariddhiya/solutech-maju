import { NextRequest } from 'next/server';
import { getAuthUser } from '@/middlewares/auth.middleware';
import {
  createNewOrder,
  getUserOrders,
} from '@/modules/orders/order.service';
import { orderSchema } from '@/modules/orders/order.schema';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const parsed = orderSchema.parse(body);
    const order = await createNewOrder(user.userId, parsed);

    return success(order, 'Order created successfully', 201);
  } catch (err) {
    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors ?? null);
    }

    const validationError = handleValidationError(err);
    return error(
      validationError.message,
      validationError.statusCode,
      validationError.errors ?? null
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const orders = await getUserOrders(user.userId);

    return success(orders, 'Orders retrieved successfully');
  } catch (err) {
    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors ?? null);
    }

    return error('Internal server error', 500);
  }
}
