import { RequestContext } from '@/lib/request-context';
import { checkApiRateLimit, checkLoginRateLimit } from '@/lib/rate-limit';
import { RateLimitError } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/constants/error-message.constant';

export function applyRateLimit(
  context: RequestContext,
  type: 'login' | 'api' = 'api'
): void {
  const result =
    type === 'login'
      ? checkLoginRateLimit(context.ip)
      : checkApiRateLimit(context.ip);

  if (!result.allowed) {
    throw new RateLimitError(ERROR_MESSAGES.COMMON.TOO_MANY_REQUESTS);
  }
}
