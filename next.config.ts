import type { NextConfig } from "next";

// Replace this with the actual, raw Vercel URL of your Editor project
const EDITOR_URL = 'https://cinehoria-editor.vercel.app'; 

const nextConfig: NextConfig = {
  // This forces all CSS and JS files to load directly from the Editor's servers,
  // bypassing the Main website's routing entirely.
  assetPrefix: EDITOR_URL,
};

export default nextConfig;