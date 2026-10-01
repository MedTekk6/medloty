import { LotPageClient } from '@/components/LotPageClient'
import { getLotBySlug } from '@/data/lots'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { productJsonLd, breadcrumbJsonLd, SITE_URL } from '@/lib/seo'

const SLUG = 'serviettes-papier-30x30'

export function generateMetadata(): Metadata {
  const lot = getLotBySlug(SLUG)
  if (!lot) return {}
  const url = `${SITE_URL}/lots/${lot.slug}`
  return {
    title: `${lot.title} — MedLoty`,
    description: lot.description,
    keywords: [lot.shortTitle, ...lot.highlights, 'gros Sénégal', 'grossiste détail', 'MedLoty'],
    alternates: { canonical: `/lots/${lot.slug}` },
    openGraph: {
      title: `${lot.title} — MedLoty`,
      description: lot.description,
      url,
      siteName: 'MedLoty',
      locale: 'fr_SN',
      type: 'website',
      images: [{ url: lot.heroImg, width: 1600, height: 900, alt: lot.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${lot.title} — MedLoty`,
      description: lot.description,
      images: [lot.heroImg],
    },
  }
}

export default function Page() {
  const lot = getLotBySlug(SLUG)
  if (!lot) return notFound()
  return (
    <>
      <JsonLd data={productJsonLd(lot)} />
      <JsonLd data={breadcrumbJsonLd(lot)} />
      <LotPageClient lot={lot} />
    </>
  )
}