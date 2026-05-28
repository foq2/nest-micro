import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  port: process.env.API_GATEWAY_PORT,
}));
