'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { lots as dataLots, SLIDER_IMAGES } from '@/data/lots'

const lots = [
  {
    num: '00',
    icon: '✨',
    title: 'Toute la gamme',
    detail: '12 produits disponibles',
    qty: '12',
    unit: 'produits',
    accent: '#1A5C38',
    accentLight: '#EDFBF3',
    img: '/assets/tout.webp',
  },
  ...dataLots.map((l) => ({
    num: l.num,
    icon: l.icon,
    title: l.shortTitle,
    detail: `${l.totalQtyLabel} ${l.unit} disponibles`,
    qty: l.totalQtyLabel,
    unit: l.unit,
    accent: l.accent,
    accentLight: l.accentLight,
    img: SLIDER_IMAGES[l.slug] ?? l.heroImg,
  })),
]

export function Hero() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const goTo = useCallback((idx: number) => {
    setActive(idx)
  }, [])

  const next = useCallback(() => goTo((active + 1) % lots.length), [active, goTo])

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(next, 5000)
  }, [next])

  useEffect(() => {
    timer.current = setInterval(next, 5000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [next])

  const cur = lots[active]

  return (
    <section className={`hero${visible ? ' hero-visible' : ''}`}>

      {/* ── FOND KRAFT + ORBES (cohérent avec le reste du site) ── */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-grain" />
      </div>

      {/* ── CONTENU ── */}
      <div className="hero-content">

        {/* Gauche */}
        <div className="hero-left">
          <h1 className="hero-h1">
            <span className="hero-h1-green">Emballages en gros</span>
            <span className="hero-h1-gold">et au détail</span>
          </h1>

          <p className="hero-sub">
            Grossiste en emballages alimentaires au Sénégal. Commandez au détail dès 50 pièces,
            ou bénéficiez d'une réduction exceptionnelle de 15% à partir de 1000 pièces.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">12</span>
              <span className="hero-stat-label">Produits disponibles</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val">2.5M+</span>
              <span className="hero-stat-label">Pièces en stock</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val">Sénégal</span>
              <span className="hero-stat-label">Livraison partout</span>
            </div>
          </div>

          <div className="hero-cta-row">
            <a href="#lots" className="hero-cta-main">
              Voir les lots
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a href="/liquidation" className="hero-cta-liq">
              Cliquez ici pour voir les lots à liquider
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <span className="hero-cta-hand" aria-hidden="true">
              <svg width="24" height="32" viewBox="0 0 384 512" fill="#8B5A1A">
                <path d="M32 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-208-64 0 0 208zM224 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64zm-64 64c17.7 0 32-14.3 32-32l0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48c0 17.7 14.3 32 32 32zm160-96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64zm-96-88l0 .6c9.4-5.4 20.3-8.6 32-8.6c13.2 0 25.4 4 35.6 10.8c8.7-24.9 32.5-42.8 60.4-42.8c11.7 0 22.6 3.1 32 8.6l0-8.6C384 71.6 312.4 0 224 0L162.3 0C119.8 0 79.1 16.9 49.1 46.9L37.5 58.5C13.5 82.5 0 115.1 0 149l0 27c0 35.3 28.7 64 64 64l88 0c22.1 0 40-17.9 40-40s-17.9-40-40-40l-56 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l56 0c39.8 0 72 32.2 72 72z"/>
              </svg>
            </span>
          </div>

          {/* Dots navigation */}
          <div className="hero-dots" role="tablist" aria-label="Lots disponibles">
            {lots.map((lot, i) => (
              <button
                key={lot.num}
                role="tab"
                aria-selected={i === active}
                aria-label={lot.title}
                className={`hero-dot${i === active ? ' hero-dot-on' : ''}`}
                style={{ '--dc': lot.accent } as React.CSSProperties}
                onClick={() => { goTo(i); resetTimer() }}
              />
            ))}
          </div>
        </div>

        {/* Droite — produit flottant sur fond transparent */}
        <div className="hero-right">

          {/* Halo coloré derrière le produit */}
          <div className="hero-glow" style={{ '--ac': cur.accent } as React.CSSProperties} />

          {/* Produit (toutes les images superposées, crossfade pur opacité) */}
          <div className="hero-product-stack">
            {lots.map((lot, i) => (
              <div
                key={lot.num}
                className="hero-product-slide"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <Image
                  src={lot.img}
                  alt={lot.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 80vw, 480px"
                />
              </div>
            ))}
          </div>

          {/* Carte info lot — flotte sous le produit */}
          <div className="hero-lot-card" style={{ '--ac': cur.accent, '--al': cur.accentLight } as React.CSSProperties}>
            <div className="hero-lot-thumb">
              <Image src={cur.img} alt={cur.title} fill style={{ objectFit: 'contain' }} sizes="42px" />
            </div>
            <div className="hero-lot-text">
              <span className="hero-lot-name">{cur.title}</span>
              <span className="hero-lot-detail">{cur.detail}</span>
            </div>
            <div className="hero-lot-qty">
              <span className="hero-lot-qty-num">{cur.qty}</span>
              <span className="hero-lot-qty-unit">{cur.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-inner">
          {[...Array(4)].flatMap(() => [
            'Vente en gros ou au détail', '✦',
            'Dès 50 pièces', '✦',
            'Qualité garantie', '✦',
            'Livraison partout au Sénégal', '✦',
            'Stock disponible', '✦',
          ]).map((item, i) => (
            <span key={i} className={item === '✦' ? 'hero-ticker-sep' : 'hero-ticker-item'}>{item}</span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;0,900;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: #F8F4EC;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          padding-top: 64px;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hero-visible { opacity: 1; }

        /* Fond */
        .hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); opacity: 0.22;
        }
        .hero-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, #22C55E 0%, transparent 70%);
          top: -300px; left: -200px;
        }
        .hero-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #C8843A 0%, transparent 70%);
          bottom: -100px; right: -100px;
        }
        .hero-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        /* Layout */
        .hero-content {
          position: relative; z-index: 2; flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1240px; width: 100%;
          margin: 0 auto;
          padding: 56px 32px 40px;
          align-items: center;
        }

        /* Gauche */
        .hero-left { display: flex; flex-direction: column; }
        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4.8vw, 62px);
          font-weight: 900; line-height: 1.18;
          letter-spacing: -2px; margin: 0 0 18px;
          display: flex; flex-direction: column;
        }
        .hero-h1-green { color: #1A5C38; }
        .hero-h1-gold { color: #C8843A; }

        .hero-sub {
          font-size: 15px; color: #5A6A5A; line-height: 1.75;
          max-width: 480px; margin-bottom: 28px; font-weight: 500;
        }

        .hero-stats { display: flex; gap: 28px; margin-bottom: 32px; }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .hero-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 900; color: #0F1A0F; line-height: 1;
        }
        .hero-stat-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: #9CA3AF;
        }
        .hero-stat-sep { width: 1px; height: 36px; background: #E0D8C8; align-self: center; }

        .hero-cta-row { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }

        .hero-cta-main {
          display: inline-flex; align-items: center; gap: 8px;
          background: #1A5C38; color: white;
          font-size: 14px; font-weight: 800;
          padding: 13px 28px; border-radius: 100px;
          text-decoration: none; width: fit-content;
          box-shadow: 0 8px 28px rgba(26,92,56,0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s;
        }
        .hero-cta-main:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(26,92,56,0.38);
          background: #0F3D25;
        }
        .hero-cta-liq {
          display: inline-flex; align-items: center; gap: 8px;
          background: #C8843A; color: white;
          font-size: 13px; font-weight: 800;
          padding: 13px 24px; border-radius: 100px;
          text-decoration: none; width: fit-content;
          box-shadow: 0 8px 28px rgba(200,132,58,0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s;
        }
        .hero-cta-liq:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(200,132,58,0.38);
          background: #A66A28;
        }
        .hero-cta-liq svg { transition: transform 0.25s ease; }
        .hero-cta-liq:hover svg { transform: translateX(4px); }
        .hero-cta-main svg { transition: transform 0.25s ease; }
        .hero-cta-main:hover svg { transform: translateX(4px); }

        .hero-cta-hand {
          display: flex; flex-shrink: 0;
          filter: drop-shadow(0 6px 10px rgba(139,90,26,0.35));
          animation: heroHandPoint 1.3s ease-in-out infinite;
        }
        @keyframes heroHandPoint {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(9px); }
        }

        /* Dots */
        .hero-dots { display: flex; gap: 7px; align-items: center; }
        .hero-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 1.5px solid var(--dc, #ccc); background: transparent;
          cursor: pointer; padding: 0; transition: all 0.3s ease;
        }
        .hero-dot-on { background: var(--dc); width: 22px; border-radius: 4px; }

        /* Droite — zone produit */
        .hero-right {
          position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 460px;
        }

        .hero-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--ac) 0%, transparent 70%);
          opacity: 0.18;
          filter: blur(40px);
          z-index: 0;
          transition: background 0.6s ease;
        }

        .hero-product-stack {
          position: relative;
          width: 100%;
          max-width: 420px;
          aspect-ratio: 1 / 1;
          z-index: 1;
        }
        .hero-product-slide {
          position: absolute; inset: 0;
          transition: opacity 0.9s ease-in-out;
        }
        .hero-product-slide img {
          filter: drop-shadow(0 24px 40px rgba(15,26,15,0.18));
        }

        /* Carte info lot */
        .hero-lot-card {
          position: relative;
          z-index: 2;
          display: flex; align-items: center; gap: 12px;
          background: white;
          border: 1.5px solid var(--al);
          border-radius: 100px;
          padding: 10px 22px 10px 10px;
          box-shadow: 0 8px 28px rgba(15,26,15,0.08);
          margin-top: -8px;
        }
        .hero-lot-thumb {
          position: relative;
          width: 42px; height: 42px; flex-shrink: 0;
          background: var(--al); border-radius: 50%;
          padding: 6px;
          box-sizing: border-box;
        }
        .hero-lot-text { display: flex; flex-direction: column; gap: 1px; }
        .hero-lot-name {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 800; color: #0F1A0F; line-height: 1.2;
        }
        .hero-lot-detail { font-size: 11px; color: #9CA3AF; font-weight: 600; }
        .hero-lot-qty { margin-left: auto; text-align: right; flex-shrink: 0; }
        .hero-lot-qty-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 900; color: var(--ac); line-height: 1;
        }
        .hero-lot-qty-unit { font-size: 9px; color: #9CA3AF; font-weight: 700; text-transform: uppercase; }

        /* Ticker */
        .hero-ticker {
          position: relative; z-index: 2;
          border-top: 1.5px solid #E5DDD0;
          background: white;
          overflow: hidden; height: 40px;
          display: flex; align-items: center;
        }
        .hero-ticker-inner {
          display: flex; align-items: center;
          white-space: nowrap;
          animation: ticker 28s linear infinite;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-25%); }
        }
        .hero-ticker-item {
          font-size: 12px; font-weight: 700; color: #3D5A3D;
          padding: 0 18px; text-transform: uppercase; letter-spacing: 1px;
        }
        .hero-ticker-sep { color: #C8843A; font-size: 14px; padding: 0 4px; }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 40px 24px 32px;
          }
          .hero-right { order: -1; min-height: 380px; }
          .hero-left { align-items: center; text-align: center; }
          .hero-sub { margin-left: auto; margin-right: auto; text-align: center; }
          .hero-stats { justify-content: center; }
          .hero-cta-row { margin-left: auto; margin-right: auto; }
          .hero-dots { justify-content: center; }
        }

        @media (max-width: 640px) {
          .hero-cta-liq { font-size: 12px; padding: 11px 18px; text-align: center; }
          .hero-content { padding: 28px 16px 24px; gap: 24px; }
          .hero-h1 { font-size: clamp(28px, 7.5vw, 42px); letter-spacing: -1px; }
          .hero-stats { gap: 20px; }
          .hero-stat-val { font-size: 24px; }
          .hero-right { min-height: 320px; }
          .hero-product-stack { max-width: 280px; }
          .hero-glow { width: 280px; height: 280px; }
          .hero-lot-card { padding: 8px 16px 8px 8px; gap: 9px; }
          .hero-lot-thumb { width: 34px; height: 34px; padding: 5px; }
          .hero-lot-name { font-size: 12.5px; }
          .hero-lot-detail { font-size: 10px; }
        }

        @media (max-width: 400px) {
          .hero-product-stack { max-width: 220px; }
          .hero-stat { padding: 0 4px; }
          .hero-stats { gap: 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-product-slide { transition: none; }
          .hero-ticker-inner { animation: none; }
          .hero-dot-pulse { animation: none; }
        }
      `}</style>
    </section>
  )
}