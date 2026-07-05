import { z } from 'zod';
import { ERROR_MESSAGES } from '@/constants/error-message.constant';

export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const orderSchema = z
  .object({
    items: z
      .array(orderItemSchema)
      .min(1, ERROR_MESSAGES.ORDER.EMPTY_ITEMS),
  })
  .refine(
    (data) => {
      const ids = data.items.map((item) => item.productId);
      return new Set(ids).size === ids.length;
    },
    {
      message: ERROR_MESSAGES.ORDER.DUPLICATE_PRODUCT,
      path: ['items'],
    }
  );

export type OrderInput = z.infer<typeof orderSchema>;
