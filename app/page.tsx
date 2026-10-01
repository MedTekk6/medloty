import type { Metadata } from 'next'
import { HomeClient } from '@/components/HomeClient'
import { JsonLd } from '@/components/JsonLd'
import { organizationJsonLd, pricingItemListJsonLd, pricingFaqJsonLd, SITE_URL } from '@/lib/seo'
import { lots } from '@/data/lots'

export const metadata: Metadata = {
  title: 'MedLoty — Emballages alimentaires en gros au Sénégal | Détail & Grossiste -15%',
  description:
    "Gobelets, sacs kraft, barquettes, emballages sur mesure en gros au Sénégal. Détail dès 50 pièces, tarif Grossiste avec -15% dès 1000 pièces, livraison partout au Sénégal.",
  keywords: [
    'emballages alimentaires Sénégal',
    'gobelets carton gros Sénégal',
    'sacs kraft gros Dakar',
    'barquettes alimentaires Sénégal',
    'grossiste détail Sénégal',
    'grossiste emballage Dakar',
    'prix grossiste -15%',
    'emballage personnalisé logo Sénégal',
    'MedLoty',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MedLoty — Emballages alimentaires en gros au Sénégal',
    description:
      "Gobelets, sacs kraft, barquettes, emballages sur mesure. Détail dès 50 pièces, tarif Grossiste -15% dès 1000 pièces, livraison partout au Sénégal.",
    url: SITE_URL,
    siteName: 'MedLoty',
    locale: 'fr_SN',
    type: 'website',
    images: [
      {
        url: '/assets/logo.webp',
        width: 512,
        height: 512,
        alt: 'MedLoty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedLoty — Emballages alimentaires en gros au Sénégal',
    description:
      "Gobelets, sacs kraft, barquettes, emballages sur mesure. Détail dès 50 pièces, Grossiste -15% dès 1000 pièces.",
    images: ['/assets/logo.webp'],
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={pricingItemListJsonLd(lots)} />
      <JsonLd data={pricingFaqJsonLd(lots)} />
      <HomeClient />
    </>
  )
}