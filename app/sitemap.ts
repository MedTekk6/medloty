import type { MetadataRoute } from 'next'
import { lots } from '@/data/lots'

export const dynamic = 'force-static'

const BASE_URL = 'https://medloty.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const lotPages: MetadataRoute.Sitemap = lots.map((lot) => ({
    url: `${BASE_URL}/lots/${lot.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...lotPages,
    {
      url: `${BASE_URL}/prix-tarifs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/liquidation`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}