import { prisma } from '@/lib/prisma';

export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}
