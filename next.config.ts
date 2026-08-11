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

// Determine basePath for GitHub Pages subpath deployment (e.g. /<repo-name>) or custom domain
const getBasePath = (): string => {
  // 1. Explicitly configured via environment variable
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/+$/, '');
  }
  if (process.env.BASE_PATH) {
    return process.env.BASE_PATH.replace(/\/+$/, '');
  }
  // 2. Automated detection from GitHub Actions environment (GITHUB_REPOSITORY = "owner/repo")
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    // If repository is "<owner>.github.io", it is hosted at domain root
    if (repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
      return '';
    }
    if (repo) {
      return `/${repo}`;
    }
  }
  // 3. Fallback to root (local development, AI Studio preview, etc.)
  return '';
};

const basePath = getBasePath();

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  output: 'export',
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
