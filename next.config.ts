import { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://resume-generator-production.up.railway.app/:path*',
      },
    ]
  },
}

export default config
