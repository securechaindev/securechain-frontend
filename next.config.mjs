/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use export for static files to serve with Nginx
  output: 'export',
  // Disable features not compatible with static export
  trailingSlash: true,
  experimental: {
    ppr: false,
  },
};

export default nextConfig;
