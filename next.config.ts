import type { NextConfig } from 'next';

import 'dotenv/config';

const nextConfig: NextConfig = {
  /* config options here */
  env: Object.keys(process.env)
    .filter((key) => key.startsWith('PUSHER_APP'))
    .reduce((acc: Record<string, string>, key: string) => {
      acc[key] = process.env[key]!;
      return acc;
    }, {}),
};

export default nextConfig;
