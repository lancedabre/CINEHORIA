import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cinehoria.vercel.app'

  return [
    {
      url: baseUrl, // Your main landing page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // 1.0 means this is the most important page on the site
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Note: We intentionally do NOT include /dashboard or /project/[id] here
  ]
}