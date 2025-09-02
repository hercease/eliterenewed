const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/], // 👈 exclude
})

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

module.exports = withPWA(nextConfig)
