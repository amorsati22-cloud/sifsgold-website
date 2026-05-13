/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: false },
      { source: "/for-professionals", destination: "/for-pros", permanent: true },
    ];
  },
};

export default nextConfig;
