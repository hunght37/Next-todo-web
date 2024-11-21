/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, 'mongodb'];
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "mongodb+srv://Teseter1:4oNjmcc4jmoPrgj8@cluster0.slzq6.mongodb.net/todo_db?retryWrites=true&w=majority"
  }
};

module.exports = nextConfig;
