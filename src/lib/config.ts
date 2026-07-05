export const config = {
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '1d'),
  nodeEnv: process.env.NODE_ENV || 'development',
  rateLimitWindowSeconds: getNumber('RATE_LIMIT_WINDOW_SECONDS', 900),
  rateLimitMaxRequests: getNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  loginRateLimitMaxRequests: getNumber('LOGIN_RATE_LIMIT_MAX_REQUESTS', 5),
  enableRequestLogging: getBoolean('ENABLE_REQUEST_LOGGING', true),
  enableRateLimiting: getBoolean('ENABLE_RATE_LIMITING', true),
};

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function getNumber(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return parsed;
}

function getBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}
