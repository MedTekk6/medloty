import type { Metadata } from 'next'
import { PrixTarifsClient } from '@/components/PrixTarifsClient'

export const metadata: Metadata = {
  title: 'Grille tarifaire — Prix de gros dès 50 pièces',
  description:
    "Découvrez nos tarifs de gros par produit : commande dès 50 pièces, prix fixe avantageux par pièce. Emballages alimentaires en gros au Sénégal.",
  keywords: ['prix emballages gros Sénégal', 'tarif gros pièces', 'grille tarifaire MedLoty', 'prix de gros'],
  alternates: { canonical: '/prix-tarifs' },
  openGraph: {
    title: 'Grille tarifaire MedLoty — Prix de gros dès 50 pièces',
    description:
      "Commande dès 50 pièces, prix de gros fixe par pièce. Livraison partout au Sénégal.",
    url: 'https://medloty.com/prix-tarifs',
    siteName: 'MedLoty',
    locale: 'fr_SN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Grille tarifaire MedLoty',
    description: "Prix de gros dès 50 pièces par produit.",
  },
}

export default function PrixTarifsPage() {
  return <PrixTarifsClient />
}