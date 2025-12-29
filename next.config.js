/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdac145-1.fna.fbcdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig