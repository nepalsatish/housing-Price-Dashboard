/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:5000/:path*',
      // },
      {
        source: '/api/:path*',
        destination: 'https://housing-price-dashboard-j63g.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 