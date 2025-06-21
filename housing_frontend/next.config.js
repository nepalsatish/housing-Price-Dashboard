/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://housing-price-dashboard-j63g.onrender.com/api:path*',
      },
    ];
  },
};

module.exports = nextConfig; 