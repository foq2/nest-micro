import { registerAs } from '@nestjs/config';

export const appCommonConfiguration = registerAs('appCommon', () => ({
  timezone: process.env.tz,
  nodeEnv: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
}));
