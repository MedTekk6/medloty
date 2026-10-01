'use client'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CartContent } from '@/components/cart/cart-content'

export function PanierClient() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: '#FAFAFA' }}>
      <SiteHeader />
      <main style={{ flex: 1, paddingTop: '88px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: 'clamp(28px, 3vw, 36px)', 
            fontWeight: 800, 
            color: '#111827',
            marginBottom: '32px'
          }}>
            Mon <span style={{ color: '#C8843A' }}>panier</span>
          </h1>
          <CartContent />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}