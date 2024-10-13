const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
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
