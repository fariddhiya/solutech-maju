import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getAuthUser } from '@/middlewares/auth.middleware';
import {
  createNewOrder,
  getUserOrders,
} from '@/modules/orders/order.service';
import { orderSchema } from '@/modules/orders/order.schema';
import { success, error } from '@/lib/response';
import { ApiError } from '@/lib/errors';
import { handleValidationError } from '@/lib/validation';
import { handlePrismaError } from '@/lib/prisma-error';
import { SUCCESS_MESSAGES } from '@/constants/success-message.constant';
import { createRequestContext } from '@/lib/request-context';
import { logRequest, logRequestError } from '@/lib/logger';
import { applyRateLimit } from '@/middlewares/rate-limit.middleware';

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'api');
    const user = getAuthUser(request);
    const body = await request.json();
    const parsed = orderSchema.parse(body);
    const order = await createNewOrder(user.userId, parsed);

    logRequest(context, 201);
    return success(order, SUCCESS_MESSAGES.ORDER.CREATED, 201);
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

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    applyRateLimit(context, 'api');
    const user = getAuthUser(request);
    const orders = await getUserOrders(user.userId);

    logRequest(context, 200);
    return success(orders, SUCCESS_MESSAGES.ORDER.FETCHED);
  } catch (err) {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    logRequestError(context, err, statusCode);

    if (err instanceof ApiError) {
      return error(err.message, err.statusCode, err.errors ?? null);
    }

    const prismaError = handlePrismaError(err);
    return error(
      prismaError.message,
      prismaError.statusCode,
      prismaError.errors ?? null
    );
  }
}
