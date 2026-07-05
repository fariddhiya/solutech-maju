import { RequestContext } from '@/lib/request-context';
import { logRequest, logRequestError } from '@/lib/logger';

export function logRequestMiddleware(
  context: RequestContext,
  statusCode: number,
  message?: string
): void {
  logRequest(context, statusCode, message);
}

export function logRequestErrorMiddleware(
  context: RequestContext,
  error: unknown,
  statusCode?: number
): void {
  logRequestError(context, error, statusCode);
}
