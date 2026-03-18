import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Let the bots crawl the public pages
      allow: ['/', '/login'],
      // Keep the bots out of the private app sections
      disallow: ['/dashboard', '/project/'],
    },
    // Point Google directly to your sitemap
    sitemap: 'https://cinehoria.vercel.app/sitemap.xml',
  }
}