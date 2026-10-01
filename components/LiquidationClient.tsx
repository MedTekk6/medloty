'use client'

import { useState, useEffect, useRef } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { liquidationItems, grandsSacsKraftNote } from '@/data/liquidation'
import { trackPixelEvent } from '@/lib/meta-pixel'

const WHATSAPP_NUMBER = '212644261566'
const fmt = (n: number) => n.toLocaleString('fr-FR')

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="liqp-wa-icon" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const SwapIcon = () => (
  <svg viewBox="0 0 24 24" className="liqp-swap-icon" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M7 10l-4 4 4 4M3 14h13M17 4l4 4-4 4M21 8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function LiquidationClient() {
  const [currency, setCurrency] = useState<'DH' | 'FCFA'>('DH')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.liqp-fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('liqp-in'), i * 60)
            })
          }
        })
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const buildWhatsappLink = (name: string) => {
    const message = `Bonjour, je suis intéressé(e) par le lot "${name}" en liquidation. Pouvez-vous m'en dire plus ?`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  const toggleCurrency = () => {
    setCurrency((c) => (c === 'DH' ? 'FCFA' : 'DH'))
  }

  const priceLabel = (dh: number, fcfa: number) =>
    currency === 'DH' ? `${dh.toLocaleString('fr-FR')} DH` : `${fmt(fcfa)} FCFA`

  return (
    <div className="liqp-root">
      <SiteHeader />

      <main ref={sectionRef} className="liqp">
        <div className="liqp-hero">
          <div className="liqp-wrap">
            <span className="liqp-eyebrow liqp-fu">✦ Offre spéciale</span>
            <h1 className="liqp-title liqp-fu">Lots à liquider — prix imbattables</h1>
            <p className="liqp-sub liqp-fu">
              Accessoires, emballages, quincaillerie, vaisselle... Qualité, rapidité et
              petits prix garantis ! Chaque lot se vend en intégralité, à un seul acheteur.
            </p>

            <button type="button" className="liqp-currency-btn liqp-fu" onClick={toggleCurrency}>
              <SwapIcon />
              Afficher en {currency === 'DH' ? 'FCFA' : 'DH'}
            </button>
          </div>
        </div>

        <div className="liqp-wrap liqp-grid">
          {liquidationItems.map((item) => (
            <div key={item.slug} className="liqp-card liqp-fu" style={{ ['--ac' as any]: item.accent, ['--al' as any]: item.accentLight }}>
              <div className="liqp-card-media">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="liqp-card-photo" />
                ) : (
                  <span className="liqp-card-icon">{item.icon}</span>
                )}
                <span className="liqp-card-badge">Lot unique</span>
              </div>

              <div className="liqp-card-body">
                <h2 className="liqp-card-title">{item.name}</h2>
                <span className="liqp-card-location">📍 Disponible à {item.location}</span>

                <div className="liqp-card-stats">
                  <div className="liqp-stat">
                    <span className="liqp-stat-val">{item.totalQtyLabel}</span>
                    <span className="liqp-stat-lbl">{item.totalQty !== null ? item.unit : ''}</span>
                  </div>
                  <div className="liqp-stat">
                    <span className="liqp-stat-val">{priceLabel(item.pricePerUnitDH, item.pricePerUnit)}</span>
                    <span className="liqp-stat-lbl">par pièce</span>
                  </div>
                </div>

                <a
                  href={buildWhatsappLink(item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liqp-btn"
                  onClick={() => trackPixelEvent('Contact', { content_name: `${item.name} — Liquidation WhatsApp` })}
                >
                  <WhatsAppIcon />
                  <span className="liqp-btn-full">Discuter sur WhatsApp</span>
                  <span className="liqp-btn-short">WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="liqp-wrap">
          <div className="liqp-note liqp-fu">
            <img src={grandsSacsKraftNote.image} alt={grandsSacsKraftNote.name} className="liqp-note-photo" />
            <p className="liqp-note-text">
              Également disponible : un lot de <strong>{grandsSacsKraftNote.totalQtyLabel} {grandsSacsKraftNote.unit}</strong> de{' '}
              <strong>{grandsSacsKraftNote.name}</strong>, à {priceLabel(grandsSacsKraftNote.pricePerUnitDH, grandsSacsKraftNote.pricePerUnit)}/pièce (référence), disponible à Casablanca.{' '}
              <a
                href={buildWhatsappLink(grandsSacsKraftNote.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPixelEvent('Contact', { content_name: `${grandsSacsKraftNote.name} — Liquidation WhatsApp` })}
              >
                Nous contacter sur WhatsApp →
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppButton />

      <style>{`
        .liqp-root { display: flex; flex-direction: column; min-height: 100vh; }
        .liqp { flex: 1; }
        .liqp-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; box-sizing: border-box; }

        .liqp-hero {
          padding: 108px 0 48px;
          background:
            linear-gradient(135deg, rgba(42,27,16,0.55) 0%, rgba(107,66,38,0.42) 55%, rgba(200,132,58,0.32) 100%),
            url('/assets/destockage.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
        }
        .liqp-eyebrow {
          display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #F0DCC0; margin-bottom: 14px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }
        .liqp-title {
          font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 40px);
          font-weight: 800; color: #ffffff; margin: 0 0 14px; line-height: 1.2;
          text-shadow: 0 3px 14px rgba(0,0,0,0.65);
        }
        .liqp-sub {
          font-size: 14.5px; color: rgba(255,255,255,0.95); line-height: 1.7;
          max-width: 580px; margin: 0 auto 26px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }

        .liqp-currency-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
          border: 1.5px solid rgba(255,255,255,0.4); color: white;
          font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 100px;
          cursor: pointer; transition: background 0.2s, transform 0.2s;
        }
        .liqp-currency-btn:hover { background: rgba(255,255,255,0.28); transform: translateY(-2px); }
        .liqp-swap-icon { width: 16px; height: 16px; flex-shrink: 0; }

        .liqp-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
          padding: 52px 24px 40px;
        }

        .liqp-card {
          background: #ffffff; border: 1px solid #ECE6DA; border-radius: 18px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .liqp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 34px rgba(0,0,0,0.09); }

        .liqp-card-media {
          position: relative; aspect-ratio: 16 / 10; background: var(--al);
          display: flex; align-items: center; justify-content: center;
        }
        .liqp-card-icon { font-size: 56px; }
        .liqp-card-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .liqp-card-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--ac); color: white; font-size: 11px; font-weight: 800;
          padding: 5px 12px; border-radius: 100px; letter-spacing: 0.3px;
        }

        .liqp-card-body { padding: 22px; display: flex; flex-direction: column; flex: 1; }
        .liqp-card-title { font-size: 17px; font-weight: 800; color: #111827; margin: 0 0 4px; line-height: 1.3; }
        .liqp-card-location { display: block; font-size: 11.5px; color: #9CA3AF; font-weight: 600; margin-bottom: 16px; }

        .liqp-card-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
          padding-bottom: 16px; border-bottom: 1px solid #F0EBDF; margin-bottom: 20px;
        }
        .liqp-stat { display: flex; flex-direction: column; }
        .liqp-stat-val { font-size: 15px; font-weight: 800; color: #111827; }
        .liqp-stat-lbl { font-size: 10.5px; color: #9CA3AF; }

        .liqp-btn {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          background: #25D366; color: white; font-weight: 700; font-size: 13.5px;
          padding: 13px; border-radius: 11px; border: none; cursor: pointer;
          text-decoration: none; transition: background 0.2s;
          margin-top: auto;
        }
        .liqp-btn:hover { background: #1FB855; }
        .liqp-wa-icon { width: 18px; height: 18px; fill: white; flex-shrink: 0; }
        .liqp-btn-short { display: none; }

        .liqp-note {
          display: flex; align-items: center; gap: 18px;
          background: #FDF6EE; border: 1.5px solid #F0DCC0; border-radius: 16px;
          padding: 18px 22px; margin: 8px 0 64px;
        }
        .liqp-note-photo {
          width: 150px; height: 150px; border-radius: 16px; object-fit: cover;
          flex-shrink: 0; border: 1.5px solid #F0DCC0;
        }
        .liqp-note-text { font-size: 13.5px; color: #6B4226; line-height: 1.7; margin: 0; }
        .liqp-note-text strong { color: #A66A28; }
        .liqp-note-text a { color: #1A5C38; font-weight: 700; text-decoration: none; }
        .liqp-note-text a:hover { text-decoration: underline; }

        .liqp-fu { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .liqp-in { opacity: 1; transform: translateY(0); }

        /* ══════════ RESPONSIVE ══════════ */
        @media (max-width: 860px) {
          .liqp-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; padding: 40px 18px 32px; }
          .liqp-hero { padding: 92px 0 36px; }
          .liqp-wrap { padding: 0 18px; }
          .liqp-card-icon { font-size: 42px; }
          .liqp-card-body { padding: 16px; }
          .liqp-card-title { font-size: 14.5px; }
          .liqp-stat-val { font-size: 13.5px; }
          .liqp-note { flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-bottom: 48px; }
          .liqp-note-photo { width: 110px; height: 110px; }
          .liqp-btn { font-size: 12px; padding: 11px 8px; gap: 6px; }
        }
        @media (max-width: 430px) {
          .liqp-grid { gap: 12px; padding: 30px 12px 24px; }
          .liqp-wrap { padding: 0 12px; }
          .liqp-card-stats { grid-template-columns: 1fr; gap: 4px; }
          .liqp-btn { font-size: 13px; padding: 12px 8px; gap: 7px; }
          .liqp-btn-full { display: none; }
          .liqp-btn-short { display: inline; }
        }

        @media (prefers-reduced-motion: reduce) {
          .liqp-fu, .liqp-card { transition: none !important; }
          .liqp-fu { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}