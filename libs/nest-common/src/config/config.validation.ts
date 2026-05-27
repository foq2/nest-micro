// joi
// import Joi from 'joi';
//
// export const validationSchema = Joi.object({
//   TZ: Joi.string().required(),
//   NODE_ENV: Joi.string().required(),
//   FRONTEND_URL: Joi.string().required(),
// })

// zod
import { z } from 'zod';

export const validationSchema = z.object({
  TZ: z.string(),
  NODE_ENV: z.string(),
  FRONTEND_URL: z.string(),
  AUTH_SERVICE_HOST: z.string(),
  AUTH_SERVICE_PORT: z.string(),
  USER_SERVICE_HOST: z.string(),
  USER_SERVICE_PORT: z.string(),
});

export function validate(config: Record<string, unknown>) {
  const result = validationSchema.safeParse(config);
  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:',
      z.treeifyError(result.error),
    );
    throw new Error('Invalid environment variables');
  }
  return result.data;
}
