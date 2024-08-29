/** @type {import('next').NextConfig} */
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform()
}
const nextConfig = {
    // output: 'export',
    images: {
        unoptimized: true,
    },

    env: {
        DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,
    }
};

export default nextConfig;