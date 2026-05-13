/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/login", destination: "/sign-in", permanent: false }];
  },
};

export default nextConfig;
