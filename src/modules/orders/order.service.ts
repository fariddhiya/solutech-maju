import { findOrderById } from './order.repository';
import { OrderInput } from './order.schema';

export async function createOrder(userId: string, input: OrderInput) {
  return { userId, input, message: 'Order creation will be implemented in next stage' };
}

export async function getOrderById(id: string) {
  return findOrderById(id);
}
