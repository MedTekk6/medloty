import type { Metadata } from 'next'
import { LiquidationClient } from '@/components/LiquidationClient'

export const metadata: Metadata = {
  title: 'Lots à liquider — Prix imbattables | MedLoty',
  description:
    "Accessoires, emballages, quincaillerie, vaisselle... à prix imbattables. Savons, cadres photos, sets de table, protège-cahiers, coupes à dessert, sacs — qualité et petits prix garantis.",
  keywords: ['liquidation Sénégal', 'prix imbattables', 'stock liquidation', 'accessoires gros', 'MedLoty liquidation'],
  alternates: { canonical: '/liquidation' },
  openGraph: {
    title: 'Lots à liquider — Prix imbattables | MedLoty',
    description: "Accessoires, emballages, quincaillerie, vaisselle... à prix imbattables. Qualité, rapidité et petits prix garantis !",
    url: 'https://medloty.com/liquidation',
    siteName: 'MedLoty',
    locale: 'fr_SN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Lots à liquider — Prix imbattables | MedLoty',
    description: 'Accessoires, emballages, quincaillerie, vaisselle... à prix imbattables.',
  },
}

export default function Page() {
  return <LiquidationClient />
}