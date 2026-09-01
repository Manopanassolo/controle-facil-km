import type { NextConfig } from 'next';

const isPagesPreview = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isPagesPreview ? 'export' : undefined,
  basePath: isPagesPreview ? '/controle-facil-km' : undefined,
  assetPrefix: isPagesPreview ? '/controle-facil-km/' : undefined,
  trailingSlash: isPagesPreview
};

export default nextConfig;
