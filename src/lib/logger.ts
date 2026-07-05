import { RequestContext, getDurationMs } from './request-context';
import { config } from './config';

interface LogEntry {
  level: 'info' | 'error';
  requestId: string;
  method: string;
  path: string;
  statusCode?: number;
  durationMs?: number;
  ip: string;
  userAgent: string;
  timestamp: string;
  message?: string;
}

function buildLogEntry(
  context: RequestContext,
  level: 'info' | 'error',
  statusCode?: number,
  message?: string
): LogEntry {
  return {
    level,
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    statusCode,
    durationMs: statusCode !== undefined ? getDurationMs(context) : undefined,
    ip: context.ip,
    userAgent: context.userAgent,
    timestamp: new Date().toISOString(),
    message,
  };
}

export function logRequest(
  context: RequestContext,
  statusCode: number,
  message?: string
): void {
  if (!config.enableRequestLogging) {
    return;
  }

  const entry = buildLogEntry(context, 'info', statusCode, message);
  console.info(JSON.stringify(entry));
}

export function logRequestError(
  context: RequestContext,
  error: unknown,
  statusCode?: number
): void {
  if (!config.enableRequestLogging) {
    return;
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  const entry = buildLogEntry(context, 'error', statusCode, message);
  console.error(JSON.stringify(entry));
}
