import jwt from 'jsonwebtoken';
import { config } from './config';
import { AuthUser } from '@/types/auth';

export type JwtPayload = AuthUser;

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
