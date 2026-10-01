// lib/meta-pixel.ts
// Utilitaire centralisé pour le tracking Meta Pixel (Facebook/Instagram Ads).
// Le code de base du pixel est chargé une seule fois dans app/layout.tsx.
// Ici, on ne fait qu'appeler window.fbq pour les évènements personnalisés,
// avec une vérification de sécurité (le pixel peut ne pas être encore chargé,
// ou window peut être indéfini pendant le rendu serveur/build statique).

export const META_PIXEL_ID = '2075991143272797'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type StandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Contact'

export function trackPixelEvent(event: StandardEvent, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return
  try {
    window.fbq('track', event, params)
  } catch {
    // Échec silencieux : le tracking ne doit jamais casser l'expérience utilisateur
  }
}