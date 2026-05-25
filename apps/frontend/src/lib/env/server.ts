import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
  server: {
    API_URL: z
      .url({
        error: 'Invalid API URL',
      })
      .default('http://localhost:4000'),
    CLERK_SECRET_KEY: z
      .string()
      .min(1, {
        message: 'Clerk secret key is required',
      })
      .default('your_clerk_secret_key'),
  },
  runtimeEnv: {
    API_URL: process.env.API_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
});
