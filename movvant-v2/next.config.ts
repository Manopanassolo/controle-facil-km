import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isCloudflarePages = process.env.CLOUDFLARE_PAGES === 'true';
const isStaticHosting = isGitHubPages || isCloudflarePages;

const nextConfig: NextConfig = {
  output: isStaticHosting ? 'export' : undefined,
  basePath: isGitHubPages ? '/controle-facil-km' : undefined,
  assetPrefix: isGitHubPages ? '/controle-facil-km/' : undefined,
  trailingSlash: isStaticHosting
};

export default nextConfig;
