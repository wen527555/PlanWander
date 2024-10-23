const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
    };
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  },
};

module.exports = nextConfig;
