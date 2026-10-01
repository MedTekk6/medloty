import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Export 100% statique : génère un dossier "out/" de fichiers HTML/CSS/JS
  // purs, déployable sur n'importe quel hébergement statique (pas de serveur
  // Node requis). `next build` produit directement ce dossier.
  output: 'export',

  // L'optimiseur d'images intégré de Next.js (next/image) tourne via une
  // route serveur — indisponible en export statique. On désactive donc son
  // optimisation à la volée ; les images sont pré-optimisées au build par
  // le script scripts/optimize-images.mjs (voir "npm run optimize-images"),
  // qui les compresse et les redimensionne une bonne fois pour toutes.
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // Génère des URLs en dossier (/page/index.html) plutôt qu'en fichier plat
  // (/page.html) — évite les soucis de routing sur la plupart des
  // hébergements statiques (Hostinger, cPanel, Netlify, GitHub Pages...).
  trailingSlash: true,

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
}

export default nextConfig