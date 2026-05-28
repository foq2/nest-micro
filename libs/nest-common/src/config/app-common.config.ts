import { registerAs } from '@nestjs/config';
import { NodeEnv } from '../enums';

export const appCommonConfiguration = registerAs('appCommon', () => ({
  timezone: process.env.TZ,
  nodeEnv: process.env.NODE_ENV || NodeEnv.Local,
  frontendUrl: process.env.FRONTEND_URL,
}));
