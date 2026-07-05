import { NotFoundError } from '@/lib/errors';
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
  return createProduct(input);
}

export async function updateExistingProduct(id: string, input: ProductUpdateInput) {
  await getProductById(id);
  return updateProduct(id, input);
}

export async function removeProduct(id: string) {
  await getProductById(id);
  return softDeleteProduct(id);
}
