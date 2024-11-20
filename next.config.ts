// next.config.js
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase limit to 10 MB (For Admin Product Form)
    },
  },
};

module.exports = nextConfig;
