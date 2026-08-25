import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  port: process.env.PORT || 3000,
}));
