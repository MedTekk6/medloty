import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = 'https://medloty.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Le panier est propre à chaque visiteur, aucun intérêt à l'indexer
        disallow: ['/panier'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}