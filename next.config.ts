import type { NextConfig } from "next";

// Replace this with the actual, raw Vercel URL of your studio project
const STUDIO_URL = 'https://cinehoria-studio.vercel.app'; 

const nextConfig: NextConfig = {
  // This forces all CSS and JS files to load directly from the studio's servers,
  // bypassing the Main website's routing entirely.
  assetPrefix: STUDIO_URL,
};

export default nextConfig;