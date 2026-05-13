/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live https://api.web3forms.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.web3forms.com",
].join("; ");

const nextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: false },
      { source: "/for-professionals", destination: "/for-pros", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
