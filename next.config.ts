import type { NextConfig } from "next";

const localDevOrigins = ["127.147.9.115", "127.217.110.96"];
const frontendOrigin = process.env.CRM_FRONTEND_ORIGIN;

if (frontendOrigin) {
  try {
    localDevOrigins.push(new URL(frontendOrigin).hostname);
  } catch {
    // Runtime config validation reports an invalid origin more clearly.
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [...new Set(localDevOrigins)],
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
