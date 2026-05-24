import { registerAs } from "@nestjs/config";

export const appCommonConfig = registerAs("appCommon", () => ({
  nodeEnv: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
}));
