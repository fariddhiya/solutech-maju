import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const orderSchema = z
  .object({
    items: z
      .array(orderItemSchema)
      .min(1, 'Order must contain at least one item'),
  })
  .refine(
    (data) => {
      const ids = data.items.map((item) => item.productId);
      return new Set(ids).size === ids.length;
    },
    {
      message: 'Duplicate product id in order items',
      path: ['items'],
    }
  );

export type OrderInput = z.infer<typeof orderSchema>;
