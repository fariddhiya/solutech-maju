import { findAllProducts, findProductById } from './product.repository';

export async function getProducts() {
  return findAllProducts();
}

export async function getProductById(id: string) {
  return findProductById(id);
}
