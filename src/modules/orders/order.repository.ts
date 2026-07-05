import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends' | '$use'
>;

export async function findProductsByIds(ids: string[], tx: TransactionClient) {
  return tx.product.findMany({
    where: { id: { in: ids }, isDeleted: false },
  });
}

export async function createOrder(
  userId: string,
  totalPrice: number,
  items: {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[],
  tx: TransactionClient
) {
  return tx.order.create({
    data: {
      userId,
      totalPrice,
      items: {
        create: items,
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });
}

export async function reduceStock(
  productId: string,
  quantity: number,
  tx: TransactionClient
) {
  return tx.product.update({
    where: { id: productId },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });
}

export async function findOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
