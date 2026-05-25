import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, {
        message: 'Clerk publishable key is required',
      })
      .default('your_clerk_publishable_key'),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/auth/iniciar-sesion'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/auth/registrarse'),
    NEXT_PUBLIC_METABASE_URL: z
      .string()
      .min(1, {
        message: 'Metabase URL is required',
      })
      .default('http://localhost:5000'),
    NEXT_PUBLIC_METABASE_TOKEN: z
      .string()
      .min(1, {
        message: 'Metabase token is required',
      })
      .default('your_metabase_token'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_METABASE_URL: process.env.NEXT_PUBLIC_METABASE_URL,
    NEXT_PUBLIC_METABASE_TOKEN: process.env.NEXT_PUBLIC_METABASE_TOKEN,
  },
});
