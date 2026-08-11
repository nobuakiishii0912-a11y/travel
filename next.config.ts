import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';

let buildTimestamp = 'dev';
try {
  const timestampPath = path.resolve(process.cwd(), 'public/build-timestamp.txt');
  if (fs.existsSync(timestampPath)) {
    buildTimestamp = fs.readFileSync(timestampPath, 'utf8').trim();
  }
} catch (e) {
  console.warn('Could not read build-timestamp.txt, falling back to dev:', e);
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
  },
  output: 'export',
  distDir: 'dist',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
