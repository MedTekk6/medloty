'use client'

import { useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Hero } from '@/components/landing/hero'
import { Categories } from '@/components/landing/categories'
import { SurMesureBanner } from '@/components/landing/sur-mesure-banner'
import { LiquidationBanner } from '@/components/landing/liquidation-banner'
import { Testimonials } from '@/components/landing/testimonials'
import { Cta } from '@/components/landing/cta'

export function HomeClient() {
  // Si on arrive sur l'accueil depuis une autre page avec un hash dans l'URL
  // (ex: /panier -> clic sur "Nos produits" -> /#lots), on scrolle nous-mêmes
  // vers la section une fois que la page est montée, plutôt que de compter
  // sur le comportement natif du navigateur (peu fiable avec Next.js).
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1)
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>
        <Hero />
        <Categories />
        <SurMesureBanner />
        <LiquidationBanner />
        <Testimonials />
        <Cta />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}