import { registerAs } from '@nestjs/config';

export const jwtConfiguration = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
}));
