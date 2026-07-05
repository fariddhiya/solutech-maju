import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { handlePrismaError } from '@/lib/prisma-error';
import {
  findProductsByIds,
  createOrder,
  reduceStock,
  findOrdersByUserId,
} from './order.repository';
import { OrderInput } from './order.schema';

export async function createNewOrder(userId: string, input: OrderInput) {
  const productIds = input.items.map((item) => item.productId);

  try {
    return await prisma.$transaction(async (tx) => {
      const products = await findProductsByIds(productIds, tx);

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of input.items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new NotFoundError(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new ConflictError(
            `Insufficient stock for product: ${product.name}`
          );
        }
      }

      const orderItems = input.items.map((item) => {
        const product = productMap.get(item.productId)!;
        const price = Number(product.price);
        const subtotal = price * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price,
          subtotal,
        };
      });

      const totalPrice = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      for (const item of input.items) {
        await reduceStock(item.productId, item.quantity, tx);
      }

      return createOrder(userId, totalPrice, orderItems, tx);
    });
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaError(error);
    }

    throw handlePrismaError(error);
  }
}

export async function getUserOrders(userId: string) {
  try {
    return await findOrdersByUserId(userId);
  } catch (error) {
    throw handlePrismaError(error);
  }
}
