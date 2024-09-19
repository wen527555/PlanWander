const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/here/:path*',
        destination: 'https://places.ls.hereapi.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
