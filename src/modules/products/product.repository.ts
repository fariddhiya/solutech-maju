import { prisma } from '@/lib/prisma';

export async function findAllProducts() {
  return prisma.product.findMany({
    where: { isDeleted: false },
  });
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}
