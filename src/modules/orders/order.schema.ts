import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

export type OrderInput = z.infer<typeof orderSchema>;
