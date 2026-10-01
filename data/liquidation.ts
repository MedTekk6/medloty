// data/liquidation.ts
// Catalogue "Liquidation" — stock d'opportunité ponctuel (accessoires,
// emballages, quincaillerie, vaisselle...), distinct du catalogue principal
// vendu en gros & détail. Prix affichés en DH par défaut (devise du
// fournisseur, Casablanca) avec conversion FCFA disponible sur la page.
// Taux de référence : 1 DH ≈ 61,6 FCFA.

export type LiquidationItem = {
  slug: string
  name: string
  icon: string
  image?: string // photo réelle du produit (remplace l'icône si présente)
  accent: string
  accentLight: string
  design: string // variante / design / coloris
  location: string
  totalQty: number | null // null = quantité non précisée (à confirmer avec le fournisseur)
  totalQtyLabel: string
  unit: string
  pricePerUnitDH: number // DH — prix de référence (fournisseur)
  pricePerUnit: number // FCFA — converti (≈ ×61,6)
  description: string
}

export const liquidationItems: LiquidationItem[] = [
  {
    slug: 'savons',
    name: 'Savons',
    icon: '🧼',
    image: '/assets/savons.webp',
    accent: '#1A5C38',
    accentLight: '#EDFBF3',
    design: 'Plusieurs parfums et présentations',
    location: 'Casablanca',
    totalQty: 5000,
    totalQtyLabel: '5 000',
    unit: 'pièces',
    pricePerUnitDH: 2.5,
    pricePerUnit: 150,
    description: 'Lot de savons en liquidation, disponible immédiatement.',
  },
  {
    slug: 'cadres-photos',
    name: 'Cadres Photos',
    icon: '🖼️',
    image: '/assets/cadres.webp',
    accent: '#C8843A',
    accentLight: '#FDF6EE',
    design: 'Motifs et tailles différents',
    location: 'Casablanca',
    totalQty: 500,
    totalQtyLabel: '500',
    unit: 'pièces',
    pricePerUnitDH: 12,
    pricePerUnit: 750,
    description: 'Cadres photos aux motifs et tailles variés, idéal pour boutiques de décoration ou cadeaux.',
  },
  {
    slug: 'sets-de-table',
    name: 'Sets de Table Réutilisables',
    icon: '🍽️',
    image: '/assets/sets.webp',
    accent: '#2E7D32',
    accentLight: '#EDF7EE',
    design: 'Différents coloris',
    location: 'Casablanca',
    totalQty: 250,
    totalQtyLabel: '250',
    unit: 'pièces',
    pricePerUnitDH: 8,
    pricePerUnit: 500,
    description: 'Sets de table réutilisables en plusieurs coloris, pratiques et durables.',
  },
  {
    slug: 'protege-cahiers-a4',
    name: 'Protège-cahiers A4',
    icon: '📓',
    image: '/assets/proteges.webp',
    accent: '#7A4B2E',
    accentLight: '#F5EDE6',
    design: 'Format A4',
    location: 'Casablanca',
    totalQty: 120000,
    totalQtyLabel: '120 000',
    unit: 'pièces',
    pricePerUnitDH: 0.32,
    pricePerUnit: 20,
    description: 'Grand volume de protège-cahiers format A4, parfait pour la rentrée scolaire ou la revente en gros.',
  },
  {
    slug: 'coupes-dessert-verre',
    name: 'Coupes à Dessert en Verre 8oz',
    icon: '🍮',
    image: '/assets/coupes.webp',
    accent: '#8B5A1A',
    accentLight: '#FBF3E8',
    design: 'Verre, format 8oz',
    location: 'Casablanca',
    totalQty: 20000,
    totalQtyLabel: '20 000',
    unit: 'pièces',
    pricePerUnitDH: 1.2,
    pricePerUnit: 75,
    description: 'Coupes à dessert en verre, format 8oz, idéales pour restaurants et traiteurs.',
  },
  {
    slug: 'sacs-non-tisses-liquidation',
    name: 'Sacs Non Tissés Fond Carré',
    icon: '👜',
    image: '/assets/sacsnt.webp',
    accent: '#3A7D44',
    accentLight: '#EAF5EC',
    design: '17 × 27 × 28 cm, fond carré',
    location: 'Casablanca',
    totalQty: 20000,
    totalQtyLabel: '20 000',
    unit: 'pièces',
    pricePerUnitDH: 0.9,
    pricePerUnit: 55,
    description: 'Sacs non tissés à fond carré, format 17×27×28 cm, robustes et réutilisables.',
  },
]

// Petit lot mentionné à part (en simple texte) plutôt qu'en carte, pour
// garder une grille de 6 cartes bien organisée.
export const grandsSacsKraftNote = {
  name: 'Grands Sacs Kraft',
  image: '/assets/sacskraft.webp',
  totalQtyLabel: '300',
  unit: 'pièces',
  pricePerUnitDH: 1.3,
  pricePerUnit: 80,
}

export function getLiquidationItemBySlug(slug: string): LiquidationItem | undefined {
  return liquidationItems.find((i) => i.slug === slug)
}