/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/app",
        permanent: true,
      },
      {
        source: "/ja",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
