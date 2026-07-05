import { comparePassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/errors';
import { findUserByEmail } from './auth.repository';
import { LoginInput } from './auth.schema';

export async function login(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await comparePassword(input.password, user.password);

  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
