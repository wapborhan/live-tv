import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? "/live-tv" : "",
  /* config options here */
};

export default nextConfig;
