import { Prisma } from '@prisma/client';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { handlePrismaError } from '@/lib/prisma-error';
import {
  findProducts,
  findProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} from './product.repository';
import { ProductInput, ProductUpdateInput, ProductQuery } from './product.schema';

export async function getProducts(query: ProductQuery) {
  return findProducts(query);
}

export async function getProductById(id: string) {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
}

export async function createNewProduct(input: ProductInput) {
  try {
    return await createProduct(input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictError(`Product with name "${input.name}" already exists`);
    }

    throw handlePrismaError(error);
  }
}

export async function updateExistingProduct(id: string, input: ProductUpdateInput) {
  await getProductById(id);

  try {
    return await updateProduct(id, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictError(
        `Product with name "${input.name}" already exists`
      );
    }

    throw handlePrismaError(error);
  }
}

export async function removeProduct(id: string) {
  await getProductById(id);
  return softDeleteProduct(id);
}
