import type { Metadata } from 'next'
import { PanierClient } from '@/components/cart/PanierClient'

export const metadata: Metadata = {
  title: 'Mon panier',
  description: 'Votre panier de commande MedLoty.',
  // Page personnelle à chaque visiteur : aucun intérêt à l'indexer
  robots: { index: false, follow: false },
  alternates: { canonical: '/panier' },
}

export default function PanierPage() {
  return <PanierClient />
}