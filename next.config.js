/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tối ưu compile
  swcMinify: true,
  compress: true,

  // Tối ưu images
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Tối ưu bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
      };
    }
    config.externals = [...config.externals, 'mongodb'];
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "mongodb+srv://Teseter1:4oNjmcc4jmoPrgj8@cluster0.slzq6.mongodb.net/todo_db?retryWrites=true&w=majority"
  }
};

module.exports = nextConfig;
