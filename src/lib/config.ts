export const config = {
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '1d'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
