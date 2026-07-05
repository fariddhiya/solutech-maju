export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'Authorization token is required',
  },

  USER: {
    NOT_FOUND: 'User not found',
  },

  PRODUCT: {
    NOT_FOUND: 'Product not found',
    ALREADY_EXISTS: (name: string) => `Product with name "${name}" already exists`,
    INSUFFICIENT_STOCK: (name: string) => `Insufficient stock for product: ${name}`,
  },

  ORDER: {
    EMPTY_ITEMS: 'Order must contain at least one item',
    PRODUCT_NOT_FOUND: (id: string) => `Product not found: ${id}`,
    DUPLICATE_PRODUCT: 'Duplicate product id in order items',
  },

  VALIDATION: {
    INVALID_REQUEST: 'Invalid request',
    INVALID_JSON: 'Invalid JSON body',
    INVALID_ID: 'Invalid id format',
    VALIDATION_ERROR: 'Validation error',
  },

  DATABASE: {
    DUPLICATE_VALUE: (target: string) => `Duplicate value for ${target}`,
    INVALID_REFERENCE: 'Invalid reference. Related resource not found.',
    NOT_FOUND: 'Resource not found',
    INVALID_DATA: 'Invalid data provided',
    ERROR: 'Database error',
  },

  COMMON: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    CONFLICT: 'Conflict',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
  },
} as const;
