import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Disable Next.js DevTools indicator
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  
  // API Backend URL für Production
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
            : "http://backend:8080/api/:path*", // Docker internal network
      },
    ];
  },
};

export default nextConfig;