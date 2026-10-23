import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://life-share-backend-a6.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;