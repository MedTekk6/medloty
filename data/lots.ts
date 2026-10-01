// data/lots.ts
// Données centralisées des produits — source unique de vérité
// Importé par chaque page /app/lots/[slug]/page.tsx
//
// Modèle de prix : commande à partir de 50 pièces (minOrder = 50), le pas
// d'incrémentation (+/-) est toujours de 50 en 50 (50, 100, 150, 200...).
// Chaque produit a un seul tarif par pièce (pricingTiers ne contient qu'un
// palier), calculé à partir du prix de référence pour 50 pièces. Le prix
// barré (avant réduction) est stocké dans basePrice (aussi par pièce).
//
// Note : les slugs 'gobelets-14oz' et 'gobelets-14oz-cocktail' sont
// conservés tels quels (URLs déjà partagées/indexées), même si le nom
// affiché est désormais "12oz".

export type PricingTier = {
  minQty: number
  pricePerUnit: number // en FCFA
  label: string
}

// Personnalisation (logo) — pour les produits marqués customizable: true
export const CUSTOMIZATION_SURCHARGE = 50 // FCFA supplémentaires par pièce
export const CUSTOMIZATION_MIN_ORDER = 1000 // quantité minimum pour personnaliser

// Détail / Grossiste — réduction appliquée au prix détaillant en mode Grossiste
export const WHOLESALE_DISCOUNT_PERCENT = 15

// Images dédiées (packshots détourés) utilisées sur le slider de l'accueil
// et les cartes de la grille produits — distinctes des images de couverture
// des pages produits individuelles.
export const SLIDER_IMAGES: Record<string, string> = {
  'gobelets-4oz': '/assets/slider4oz.webp',
  'gobelets-14oz-cocktail': '/assets/slider14ozcoc.webp',
  'gobelets-14oz': '/assets/slider14oz.webp',
  'pailles': '/assets/sliderpaille.webp',
  'sacs-craft': '/assets/sliderkraft.webp',
  'barquettes-lakh': '/assets/sliderlakh.webp',
  'barquettes-aluminium-s800': '/assets/slideralu.webp',
  'cuilleres': '/assets/slidercu.webp',
  'barquette-alu-18': '/assets/barqalu18.webp',
  'sac-non-tisse-bretelle-simple': '/assets/snts.webp',
  'serviettes-papier-30x30': '/assets/serv.webp',
  'gobelets-8oz': '/assets/8oz.webp',
}

export type Lot = {
  slug: string
  num: string
  title: string
  shortTitle: string
  icon: string
  accent: string
  accentLight: string
  accentDark: string
  heroImg: string
  galleryImgs: string[]
  totalQty: number
  totalQtyLabel: string
  unit: string
  dimensions?: string
  description: string
  longDescription: string
  highlights: string[]
  useCases: { icon: string; label: string; img?: string }[]
  pricingTiers: PricingTier[]
  minOrder: number
  retailMaxQty: number // quantité max en mode Détail
  wholesaleMinQty: number // quantité min pour débloquer le mode Grossiste (taille d'une caisse/carton)
  wholesaleStep: number // pas d'incrémentation en mode Grossiste
  basePrice: number // prix de référence par pièce, pour l'affichage barré
  customizable?: boolean // true si le client peut choisir une version personnalisée (+50 FCFA/pièce, min. 1000 pièces)
  otherFormats?: string[] // autres formats disponibles sur demande (via WhatsApp), non vendus directement sur le site
}

export const lots: Lot[] = [
  {
    slug: 'gobelets-4oz',
    num: '01',
    title: 'Gobelets 4oz Standard',
    shortTitle: 'Gobelets 4oz',
    icon: '☕',
    accent: '#1A5C38',
    accentLight: '#EDFBF3',
    accentDark: '#0F3D25',
    heroImg: '/assets/hero-gobelets.webp',
    galleryImgs: [
      '/assets/hero-gobelets.webp',
      '/assets/detail-gobelets.webp',
    ],
    totalQty: 500000,
    totalQtyLabel: '500 000',
    unit: 'pièces',
    description: 'Gobelets 4oz standard en carton kraft, idéal pour le café Touba, les machines à eau et la restauration rapide.',
    longDescription: "Le format universel pour toutes les boissons chaudes servies en petite quantité. Parfaitement adapté au café Touba traditionnel, aux distributeurs et machines à eau, ainsi qu'à la restauration rapide. Robuste, résistant à la chaleur, sans fuite.",
    highlights: ['Volume exceptionnel : 500 000 pièces', 'Carton kraft naturel résistant', 'Format 4oz universel', 'Idéal boissons chaudes & froides'],
    useCases: [
      { icon: '☕', label: 'Café Touba', img: '/assets/usage-gobelets-cafe-touba.webp' },
      { icon: '💧', label: 'Machines & distributeurs d\'eau' },
      { icon: '🍽️', label: 'Restauration rapide', img: '/assets/usage-gobelets-restauration.webp' },
      { icon: '🎉', label: 'Événements & cérémonies', img: '/assets/usage-gobelets-evenements.webp' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 8, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 7, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 10,
  },
  {
    slug: 'gobelets-8oz',
    num: '02',
    title: 'Gobelets 8oz',
    shortTitle: 'Gobelets 8oz',
    icon: '🥤',
    accent: '#4A7C59',
    accentLight: '#EAF5EC',
    accentDark: '#2F4E38',
    heroImg: '/assets/hero-gobelets.webp',
    galleryImgs: [
      '/assets/hero-gobelets.webp',
      '/assets/detail-gobelets.webp',
    ],
    totalQty: 15000,
    totalQtyLabel: '15 000',
    unit: 'pièces',
    description: 'Gobelets 8oz, format intermédiaire idéal pour boissons fraîches, thé glacé et jus.',
    longDescription: "Format polyvalent à mi-chemin entre le petit gobelet 4oz et les grands formats. Parfait pour les boissons fraîches servies en quantité moyenne : thé glacé, jus, sodas, smoothies. Solide et bien dimensionné pour la restauration comme la revente.",
    highlights: ['Format intermédiaire polyvalent', 'Idéal boissons fraîches', 'Bon rapport contenance/prix', 'Stock disponible'],
    useCases: [
      { icon: '🧊', label: 'Boissons fraîches & thé glacé' },
      { icon: '🥤', label: 'Jus & sodas' },
      { icon: '🍽️', label: 'Restauration rapide' },
      { icon: '🏪', label: 'Revente en boutique' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 20, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 17, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 24,
  },
  {
    slug: 'gobelets-14oz-cocktail',
    num: '03',
    title: 'Gobelets 12oz Cocktail à Jus',
    shortTitle: 'Gobelets 12oz Cocktail',
    icon: '🍹',
    accent: '#2E7D32',
    accentLight: '#EDF7EE',
    accentDark: '#1B5E20',
    heroImg: '/assets/hero-gobelets.webp',
    galleryImgs: [
      '/assets/hero-gobelets.webp',
      '/assets/detail-gobelets.webp',
    ],
    totalQty: 250000,
    totalQtyLabel: '250 000',
    unit: 'pièces',
    description: 'Gobelets 12oz avec motifs de fruits imprimés, parfaits pour cocktails et jus — version décorée du 12oz classique.',
    longDescription: "Même contenance généreuse que le gobelet 12oz classique, mais avec des motifs de fruits imprimés sur le gobelet — parfait pour donner un look festif à vos cocktails, jus et boissons fraîches. Contrairement à la version standard transparente et sans motif, ce gobelet apporte une touche visuelle qui plaît particulièrement pour les événements, bars à jus et animations.",
    highlights: ['Motifs de fruits imprimés sur le gobelet', 'Grande contenance 12oz', 'Idéal cocktails, jus & bars à jus', 'Look festif pour événements'],
    useCases: [
      { icon: '🍹', label: 'Cocktails & mocktails' },
      { icon: '🧃', label: 'Bars à jus' },
      { icon: '🎉', label: 'Événements & animations' },
      { icon: '🏪', label: 'Revente en boutique' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 40, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 34, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 46,
    otherFormats: ['Gobelets 10oz', 'Gobelets 14oz', 'Gobelets 16oz'],
  },
  {
    slug: 'gobelets-14oz',
    num: '04',
    title: 'Gobelets 12oz à Jus',
    shortTitle: 'Gobelets 12oz',
    icon: '🧃',
    accent: '#C8843A',
    accentLight: '#FDF6EE',
    accentDark: '#A66A28',
    heroImg: '/assets/hero-gobelets.webp',
    galleryImgs: [
      '/assets/hero-gobelets.webp',
      '/assets/detail-gobelets.webp',
    ],
    totalQty: 250000,
    totalQtyLabel: '250 000',
    unit: 'pièces',
    description: 'Grands gobelets 12oz transparents, sans motif — contrairement à la version Cocktail imprimée. Parfaits pour les jus, desserts glacés et boissons généreuses.',
    longDescription: "Le plus grand format de la gamme, pensé pour les jus servis en grande quantité, les desserts glacés (glaces, milk-shakes) et toute boisson nécessitant une contenance généreuse. Version transparente et sans motif — pour un look sobre et polyvalent, contrairement à la version Cocktail avec motifs de fruits imprimés. S'accompagne parfaitement de nos pailles.",
    highlights: ['Grande contenance 12oz', 'Transparent, sans motif', 'Idéal jus & desserts glacés', 'Se marie avec nos pailles'],
    useCases: [
      { icon: '🧃', label: 'Jus frais & smoothies' },
      { icon: '🍨', label: 'Desserts glacés & milk-shakes' },
      { icon: '🎉', label: 'Événements & cérémonies' },
      { icon: '🏪', label: 'Revente en boutique' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 40, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 34, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 46,
    otherFormats: ['Gobelets 10oz', 'Gobelets 14oz', 'Gobelets 16oz'],
  },
  {
    slug: 'pailles',
    num: '05',
    title: 'Paille Artistique',
    shortTitle: 'Paille Artistique',
    icon: '🥤',
    accent: '#8B5A1A',
    accentLight: '#FBF3E8',
    accentDark: '#6B4415',
    heroImg: '/assets/hero-gobelets.webp',
    galleryImgs: [
      '/assets/hero-gobelets.webp',
      '/assets/detail-gobelets.webp',
    ],
    totalQty: 4000,
    totalQtyLabel: '4 000',
    unit: 'sachets',
    description: 'Paille Artistique étirable, de couleurs différentes, en sachet de 100 pièces — idéale pour jus et boissons fraîches.',
    longDescription: "Paille Artistique étirable, vendue en sachet de 100 pièces. Coloris variés dans chaque sachet, parfaite pour accompagner vos jus, boissons fraîches et toute votre gamme de gobelets.",
    highlights: ['Sachet de 100 pièces', 'Paille étirable', 'Couleurs variées', 'Idéale pour jus & boissons'],
    useCases: [
      { icon: '🧃', label: 'Jus & boissons fraîches' },
      { icon: '🍹', label: 'Cocktails & mocktails' },
      { icon: '🎉', label: 'Événements & cérémonies' },
      { icon: '🍽️', label: 'Restauration' },
    ],
    pricingTiers: [
      { minQty: 1, pricePerUnit: 800, label: 'Détail' },
      { minQty: 10, pricePerUnit: 680, label: 'Grossiste (-15%)' },
    ],
    minOrder: 1,
    retailMaxQty: 9,
    wholesaleMinQty: 10,
    wholesaleStep: 10,
    basePrice: 1000,
  },
  {
    slug: 'sacs-craft',
    num: '06',
    title: 'Sacs Kraft 17×26×28',
    shortTitle: 'Sacs Kraft',
    icon: '🛍️',
    accent: '#A0522D',
    accentLight: '#F5EDE6',
    accentDark: '#7A3D1F',
    heroImg: '/assets/hero-sacs-craft.webp',
    galleryImgs: [
      '/assets/hero-sacs-craft.webp',
      '/assets/detail-sacs-craft.webp',
    ],
    totalQty: 200000,
    totalQtyLabel: '200 000',
    unit: 'pièces',
    dimensions: '17 × 26 × 28 cm',
    description: 'Sacs en papier kraft 17×26×28 cm, parfaits pour boutiques, courses et cadeaux avec un rendu premium.',
    longDescription: "Sacs en papier kraft robuste avec poignées torsadées, format 17×26×28 cm idéal pour boutiques, commerces et cadeaux. Aspect naturel et premium qui valorise vos produits.",
    highlights: ['Volume exceptionnel : 200 000 pièces', 'Poignées torsadées renforcées', 'Format 17×26×28 cm', 'Rendu premium pour votre marque'],
    useCases: [
      { icon: '🛒', label: 'Boutiques & commerces', img: '/assets/usage-sacs-craft-boutique.webp' },
      { icon: '🎁', label: 'Emballage cadeaux', img: '/assets/usage-sacs-craft-cadeau.webp' },
      { icon: '👗', label: 'Boutiques de mode', img: '/assets/usage-sacs-craft-mode.webp' },
      { icon: '🥖', label: 'Boulangeries & épiceries', img: '/assets/usage-sacs-craft-boulangerie.webp' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 66, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 56, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 70,
  },
  {
    slug: 'sac-non-tisse-bretelle-simple',
    num: '07',
    title: 'Sac Non Tissé Bretelle Simple',
    shortTitle: 'Sac Bretelle Simple',
    icon: '👜',
    accent: '#4E6B8E',
    accentLight: '#EAF0F5',
    accentDark: '#33475C',
    heroImg: '/assets/hero-sacs-craft.webp',
    galleryImgs: [
      '/assets/hero-sacs-craft.webp',
      '/assets/detail-sacs-craft.webp',
    ],
    totalQty: 8000,
    totalQtyLabel: '8 000',
    unit: 'pièces',
    description: 'Sac non tissé à bretelle simple, souvent offert aux clients après un petit achat.',
    longDescription: "Sac non tissé simple et pratique, avec une bretelle unique — le format idéal à donner à vos clients après un petit achat en boutique. Réutilisable, économique et écologique, il valorise votre commerce à moindre coût.",
    highlights: ['Bretelle simple pratique', 'Idéal pour accompagner les petits achats', 'Réutilisable et écologique', 'Format compact'],
    useCases: [
      { icon: '🛒', label: 'Boutiques & commerces' },
      { icon: '🥖', label: 'Épiceries & petits commerces' },
      { icon: '🎁', label: 'Cadeau client après achat' },
      { icon: '♻️', label: 'Réutilisable' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 17, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 14, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 20,
  },
  {
    slug: 'barquettes-lakh',
    num: '08',
    title: 'Barquettes Lakh',
    shortTitle: 'Barquettes Lakh',
    icon: '🍛',
    accent: '#6B4226',
    accentLight: '#F5EDE6',
    accentDark: '#4A2D1A',
    heroImg: '/assets/hero-barquettes.webp',
    galleryImgs: [
      '/assets/hero-barquettes.webp',
      '/assets/detail-barquettes.webp',
    ],
    totalQty: 300000,
    totalQtyLabel: '300 000',
    unit: 'pièces',
    description: 'Barquettes noires spécialement adaptées au format Lakh, très demandé au Sénégal.',
    longDescription: "Barquettes alimentaires noires profondes, spécialement adaptées au format Lakh très demandé au Sénégal. Étanches, empilables, qualité professionnelle pour la restauration et les traiteurs.",
    highlights: ['Volume exceptionnel : 300 000 pièces', 'Format Lakh spécifique au marché sénégalais', 'Étanche et résistant', 'Empilable pour gain de place'],
    useCases: [
      { icon: '🍛', label: 'Lakh & plats traditionnels', img: '/assets/usage-barquettes-lakh.webp' },
      { icon: '🍽️', label: 'Restaurants & traiteurs', img: '/assets/usage-barquettes-traiteur.webp' },
      { icon: '🎊', label: 'Événements religieux', img: '/assets/usage-barquettes-religieux.webp' },
      { icon: '🚚', label: 'Livraison à emporter', img: '/assets/usage-barquettes-livraison.webp' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 126, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 107, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 130,
  },
  {
    slug: 'barquettes-aluminium-s800',
    num: '09',
    title: 'Barquettes Aluminium S800',
    shortTitle: 'Barquettes Alu S800',
    icon: '🍱',
    accent: '#3A7D44',
    accentLight: '#EAF5EC',
    accentDark: '#235029',
    heroImg: '/assets/hero-barquettes.webp',
    galleryImgs: [
      '/assets/hero-barquettes.webp',
      '/assets/detail-barquettes.webp',
    ],
    totalQty: 250000,
    totalQtyLabel: '250 000',
    unit: 'pièces',
    dimensions: 'Format S800',
    description: 'Barquettes en aluminium format S800, résistantes à la chaleur, idéales pour plats chauds et livraison.',
    longDescription: "Barquettes en aluminium format S800, conçues pour résister à la chaleur et conserver les plats au chaud plus longtemps. Idéales pour la restauration, les traiteurs et la livraison de plats chauds.",
    highlights: ['Résistant à la chaleur', 'Idéal plats chauds & livraison', 'Format S800 professionnel', 'Qualité restauration'],
    useCases: [
      { icon: '🔥', label: 'Plats chauds' },
      { icon: '🍽️', label: 'Restaurants & traiteurs' },
      { icon: '🚚', label: 'Livraison à emporter' },
      { icon: '🎊', label: 'Événements' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 66, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 56, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 70,
    otherFormats: ['Alu 420', 'Alu 250', 'Alu 670', 'Alu 2 compartiments', 'Alu 1200'],
  },
  {
    slug: 'barquette-alu-18',
    num: '10',
    title: 'Barquette Aluminium 18',
    shortTitle: 'Barquette Alu 18',
    icon: '🥡',
    accent: '#2F6B6B',
    accentLight: '#E8F3F3',
    accentDark: '#1F4A4A',
    heroImg: '/assets/hero-barquettes.webp',
    galleryImgs: [
      '/assets/hero-barquettes.webp',
      '/assets/detail-barquettes.webp',
    ],
    totalQty: 6200,
    totalQtyLabel: '6 200',
    unit: 'pièces',
    dimensions: 'Format 18',
    description: 'Barquettes en aluminium format 18, résistantes à la chaleur, idéales pour plats chauds et livraison.',
    longDescription: "Barquettes en aluminium format 18, conçues pour résister à la chaleur et conserver les plats au chaud plus longtemps. Idéales pour la restauration, les traiteurs et la livraison de plats chauds — un format complémentaire au S800.",
    highlights: ['Résistant à la chaleur', 'Idéal plats chauds & livraison', 'Format 18 professionnel', 'Qualité restauration'],
    useCases: [
      { icon: '🔥', label: 'Plats chauds' },
      { icon: '🍽️', label: 'Restaurants & traiteurs' },
      { icon: '🚚', label: 'Livraison à emporter' },
      { icon: '🎊', label: 'Événements' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 66, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 56, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 70,
  },
  {
    slug: 'cuilleres',
    num: '11',
    title: 'Cuillères',
    shortTitle: 'Cuillères',
    icon: '🥄',
    accent: '#7A4B2E',
    accentLight: '#F5EDE6',
    accentDark: '#5A3720',
    heroImg: '/assets/hero-cuilleres.webp',
    galleryImgs: [
      '/assets/hero-cuilleres.webp',
      '/assets/detail-cuilleres.webp',
    ],
    totalQty: 300000,
    totalQtyLabel: '300 000',
    unit: 'pièces',
    description: 'Cuillères pratiques, idéales pour le Lakh, la soupe et les desserts.',
    longDescription: "Cuillères pratiques et prêtes à l'emploi. Parfaites pour accompagner la soupe, le Lakh et les desserts, en restauration comme lors de grands événements.",
    highlights: ['Idéal soupe, Lakh & desserts', "Pratique et prêt à l'emploi", 'Qualité restauration', 'Vendues par lot de 50 pièces minimum'],
    useCases: [
      { icon: '🍲', label: 'Soupe' },
      { icon: '🍛', label: 'Lakh & plats traditionnels' },
      { icon: '🍨', label: 'Desserts' },
      { icon: '🍽️', label: 'Restaurants & traiteurs' },
    ],
    pricingTiers: [
      { minQty: 50, pricePerUnit: 18, label: 'Détail' },
      { minQty: 1000, pricePerUnit: 15, label: 'Grossiste (-15%)' },
    ],
    minOrder: 50,
    retailMaxQty: 950,
    wholesaleMinQty: 1000,
    wholesaleStep: 1000,
    basePrice: 20,
  },
  {
    slug: 'serviettes-papier-30x30',
    num: '12',
    title: 'Serviettes Papier Blanc 1 Pli 30×30cm',
    shortTitle: 'Serviettes Papier',
    icon: '🧻',
    accent: '#8C7A5C',
    accentLight: '#F5F1E8',
    accentDark: '#5C4E38',
    heroImg: '/assets/serv.webp',
    galleryImgs: [
      '/assets/serv.webp',
    ],
    totalQty: 300,
    totalQtyLabel: '300',
    unit: 'sachets',
    dimensions: '30 × 30 cm',
    description: 'Serviettes en papier blanc, 1 pli, format 30×30cm, en sachet de 100 pièces — 300 FCFA le sachet.',
longDescription: "Serviettes en papier blanc, 1 pli, format 30×30cm. Un sachet contient 100 pièces, au prix de 300 FCFA le sachet. Disponibles aussi par caisse de 25 sachets, à 7 500 FCFA la caisse (300 FCFA × 25). Pratiques et économiques pour la restauration, les événements et l'usage quotidien.",
highlights: ['1 sachet = 100 pièces = 300 FCFA', '1 caisse = 25 sachets = 7 500 FCFA', 'Format 30×30cm, 1 pli', 'Idéal restauration & événements'],
useCases: [
  { icon: '🍽️', label: 'Restaurants & traiteurs' },
  { icon: '🎉', label: 'Événements & cérémonies' },
  { icon: '🏪', label: 'Revente en boutique' },
  { icon: '🏠', label: 'Usage quotidien' },
],
pricingTiers: [
  { minQty: 1, pricePerUnit: 300, label: 'Détail' },
  { minQty: 250, pricePerUnit: 255, label: 'Grossiste (-15%)' },
],
minOrder: 1,
retailMaxQty: 225,
wholesaleMinQty: 250,
wholesaleStep: 25,
basePrice: 400,
  },
]

export function getLotBySlug(slug: string): Lot | undefined {
  return lots.find((l) => l.slug === slug)
}

export function getOtherLots(currentSlug: string, count = 3): Lot[] {
  const others = lots.filter((l) => l.slug !== currentSlug)
  const currentIndex = lots.findIndex((l) => l.slug === currentSlug)
  // Rotation basée sur la position du produit courant, pour que chaque page
  // propose une combinaison différente plutôt que toujours les mêmes en tête.
  const offset = currentIndex >= 0 ? currentIndex % others.length : 0
  const rotated = [...others.slice(offset), ...others.slice(0, offset)]
  return rotated.slice(0, count)
}

export function getPriceForQty(lot: Lot, qty: number): number {
  let price = lot.pricingTiers[0].pricePerUnit
  for (const tier of lot.pricingTiers) {
    if (qty >= tier.minQty) price = tier.pricePerUnit
  }
  return price
}

export function getTierLabel(lot: Lot, qty: number): string {
  let label = lot.pricingTiers[0].label
  for (const tier of lot.pricingTiers) {
    if (qty >= tier.minQty) label = tier.label
  }
  return label
}