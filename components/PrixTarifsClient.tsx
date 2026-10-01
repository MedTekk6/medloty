'use client'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import Link from 'next/link'
import { lots } from '@/data/lots'

export function PrixTarifsClient() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: '#FAFAFA' }}>
      <SiteHeader />
      
      <main style={{ flex: 1, paddingTop: '88px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '2.5px', 
              textTransform: 'uppercase', 
              color: '#C8843A',
              display: 'block',
              marginBottom: '8px'
            }}>
              Transparence
            </span>
            <h1 style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#111827',
              marginBottom: '12px',
              lineHeight: 1.1
            }}>
              Prix & <span style={{ color: '#C8843A' }}>tarifs</span>
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#6B7280', 
              maxWidth: '600px', 
              lineHeight: 1.7,
              margin: '0 auto'
            }}>
              Des prix de gros compétitifs, dès 50 pièces par produit.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px',
            marginBottom: '48px'
          }}>
            {[
              { number: '12', label: 'Produits disponibles', icon: '📦' },
              { number: '−30%', label: 'Économies sur les gros volumes', icon: '💰' },
              { number: 'Sénégal', label: 'Livraison partout', icon: '🚚' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #f3f4f6',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F0DCC0'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f3f4f6'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#C8843A' }}>{item.number}</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '2px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Tarifs par produit
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#6B7280' }}>Produit</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#6B7280' }}>Prix barré</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#6B7280' }}>Prix de gros</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#6B7280' }}>Prix pour 50 pièces</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700, color: '#6B7280' }}>Économie</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => {
                    const unitPrice = lot.pricingTiers[0].pricePerUnit
                    const totalFor50 = Math.round(unitPrice * lot.minOrder)
                    const eco = Math.round((1 - unitPrice / lot.basePrice) * 100)
                    return (
                      <tr key={lot.slug} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>{lot.shortTitle}</td>
                        <td style={{ padding: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                          {lot.basePrice.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#C8843A' }}>
                          {unitPrice.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ padding: '12px', color: '#111827', fontWeight: 600 }}>
                          {totalFor50.toLocaleString('fr-FR')} FCFA
                          <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '12px' }}>
                            {' '}({lot.minOrder.toLocaleString('fr-FR')} {lot.unit})
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#22C55E', fontWeight: 600 }}>−{eco}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>
              * Commande minimum 50 pièces par produit — voir chaque page produit pour le détail
            </p>
          </div>

          <div style={{
            marginTop: '32px',
            background: '#EDF7EE',
            borderRadius: '16px',
            padding: '32px 24px',
            border: '2px solid #C8E6C9',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1B5E20', marginBottom: '8px' }}>
              📱 Commande simplifiée
            </h3>
            <p style={{ color: '#374151', marginBottom: '16px' }}>Remplissez le formulaire, nous vous contactons pour confirmer</p>
            <Link
              href="/#paiement"
              style={{
                display: 'inline-block',
                background: '#2E7D32',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1B5E20'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2E7D32'
              }}
            >
              Voir les moyens de paiement →
            </Link>
          </div>
        </div>
      </main>
      
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}