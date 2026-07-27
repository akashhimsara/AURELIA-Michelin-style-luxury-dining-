import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IP checking to avoid HMR websocket blocking warnings in development
  allowedDevOrigins: ["192.168.5.1", "localhost:3000"],
};

export default nextConfig;
