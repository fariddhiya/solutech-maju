import { prisma } from '@/lib/prisma';
import { ProductInput, ProductUpdateInput, ProductQuery } from './product.schema';

export async function findProducts(query: ProductQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findProductById(id: string) {
  return prisma.product.findFirst({
    where: { id, isDeleted: false },
  });
}

export async function createProduct(data: ProductInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function softDeleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}
