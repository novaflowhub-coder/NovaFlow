/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure allowed dev origins for development environments
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000', 
      'http://100.127.255.249:3000',
      'http://0.0.0.0:3000',
      'localhost:3000',
      '127.0.0.1:3000',
      '100.127.255.249:3000',
      '0.0.0.0:3000',
      '172.26.208.1:3000'
    ]
  },
  // Allow cross-origin requests from development environments
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  }
}

module.exports = nextConfig
