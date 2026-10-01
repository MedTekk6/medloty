import type { Lot } from '@/data/lots'

export const SITE_URL = 'https://medloty.com'
export const SITE_NAME = 'MedLoty'
export const SITE_PHONE = '+212644261566'
export const OG_LOCALE = 'fr_SN'

/**
 * Schéma Organization/LocalBusiness — décrit MedLoty lui-même.
 * Aide Google à afficher un panneau de connaissance (Knowledge Panel) et
 * améliore la confiance générale du site aux yeux des moteurs de recherche.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.webp`,
    image: `${SITE_URL}/assets/logo.webp`,
    description:
      "Emballages alimentaires en gros et au détail, stock disponible au Sénégal — gobelets, sacs kraft, barquettes, emballages sur mesure. Détail dès 50 pièces, tarif Grossiste avec -15% dès 1000 pièces. Fondée par Mohamadou Ndiaye, jeune entrepreneur sénégalais originaire de Matam, étudiant en cycle ingénieur spécialité Intelligence Artificielle au Maroc.",
    telephone: SITE_PHONE,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Zone Industrielle Lissasfa',
      addressLocality: 'Casablanca',
      addressCountry: 'MA',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Sénégal',
    },
    founder: {
      '@type': 'Person',
      name: 'Mohamadou Ndiaye',
      jobTitle: 'Fondateur',
      description:
        "Jeune entrepreneur sénégalais originaire de Matam, étudiant en cycle ingénieur spécialité Intelligence Artificielle au Maroc.",
      nationality: 'Sénégal',
    },
    sameAs: [],
  }
}

/**
 * Schéma Product — un par lot. Permet à Google d'afficher le prix, la
 * disponibilité et d'autres infos enrichies directement dans les résultats
 * de recherche (rich snippets).
 */
/**
 * Schéma ItemList — liste tous les lots avec leur prix de départ (palier
 * "Détail"). Donne à Google (et aux IA génératives qui s'appuient sur les
 * données structurées) une vue d'ensemble exploitable des tarifs MedLoty
 * sans avoir à parser le HTML.
 */
export function pricingItemListJsonLd(lots: Lot[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Produits MedLoty et tarifs',
    itemListElement: lots.map((lot, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: lot.title,
        url: `${SITE_URL}/lots/${lot.slug}`,
        image: `${SITE_URL}${lot.heroImg}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'XOF',
          price: lot.pricingTiers[0].pricePerUnit,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  }
}

/**
 * Schéma FAQPage — questions/réponses courantes sur les tarifs. C'est le
 * format que Google et les moteurs de réponse conversationnels (IA) savent
 * le mieux extraire pour répondre directement à un client qui demande
 * "combien coûte X chez MedLoty" ou "comment fonctionne le tarif Grossiste".
 */
export function pricingFaqJsonLd(lots: Lot[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Comment fonctionnent les prix chez MedLoty ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "MedLoty propose deux modes de commande sur chaque produit : le Détail, de la quantité minimum jusqu'à 950 pièces (ou l'équivalent en sachets/cartons selon le produit), et le Grossiste, à partir de 1000 pièces, avec 15% de réduction supplémentaire sur le prix détail.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle est la différence entre le tarif Détail et le tarif Grossiste ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le tarif Détail s'applique de la commande minimum jusqu'à 950 pièces par produit. Au-delà, le tarif Grossiste s'active automatiquement à partir de 1000 pièces (par caisses de 1000), avec 15% de réduction sur le prix détail. Pour les Serviettes Papier, vendues par caisse de 25 sachets, le tarif Grossiste démarre à 10 caisses.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle est la commande minimum chez MedLoty ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `La commande minimum est de 50 pièces pour la plupart des produits (1 sachet pour la Paille Artistique et les Serviettes Papier). Chaque page produit affiche le prix Détail et le prix Grossiste (-15%) par pièce, ainsi que le prix habituel barré pour comparaison.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Où est basée MedLoty et où se trouve le stock ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "MedLoty est une société basée à Casablanca, Zone Industrielle Lissasfa (Maroc). Le stock est disponible au Sénégal et accessible via commande directement sur le site.",
        },
      },
      {
        '@type': 'Question',
        name: 'MedLoty livre-t-il partout au Sénégal ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, MedLoty livre partout au Sénégal, à Dakar comme dans les autres régions, via commande sur le site.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qui a fondé MedLoty ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MedLoty a été fondée par Mohamadou Ndiaye, un jeune entrepreneur sénégalais originaire de la région de Matam, actuellement étudiant en cycle ingénieur spécialité Intelligence Artificielle au Maroc.',
        },
      },
    ],
  }
}

export function productJsonLd(lot: Lot) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: lot.title,
    description: lot.description,
    image: `${SITE_URL}${lot.heroImg}`,
    sku: lot.slug,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/lots/${lot.slug}`,
      priceCurrency: 'XOF',
      price: lot.pricingTiers[0]?.pricePerUnit ?? lot.basePrice,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  }
}

/**
 * Schéma BreadcrumbList — améliore l'affichage du fil d'Ariane dans les
 * résultats de recherche Google (Accueil > Nos lots > [Produit]).
 */
export function breadcrumbJsonLd(lot: Lot) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Nos produits', item: `${SITE_URL}/#lots` },
      { '@type': 'ListItem', position: 3, name: lot.shortTitle, item: `${SITE_URL}/lots/${lot.slug}` },
    ],
  }
}