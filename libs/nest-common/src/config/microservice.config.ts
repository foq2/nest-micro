import { registerAs } from '@nestjs/config';

export const microserviceConfiguration = registerAs('microservice', () => ({
  authService: {
    host: process.env.AUTH_SERVICE_HOST,
    port: process.env.AUTH_SERVICE_PORT,
  },
  userService: {
    host: process.env.USER_SERVICE_HOST,
    port: process.env.USER_SERVICE_PORT,
  },
}));
