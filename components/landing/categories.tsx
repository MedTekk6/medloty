'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { lots, getPriceForQty, SLIDER_IMAGES } from '@/data/lots'
import { useCart } from '@/context/cart-context'
import { trackPixelEvent } from '@/lib/meta-pixel'

const fmt = (n: number) => n.toLocaleString('fr-FR')

export function Categories() {
  const { addItem } = useCart()
  const [added, setAdded] = useState<{ name: string; img: string } | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.cs-fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('cs-in'), i * 80)
            })
          }
        })
      },
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (lot: (typeof lots)[number]) => {
    const unitPrice = getPriceForQty(lot, lot.minOrder)
    const img = SLIDER_IMAGES[lot.slug] ?? lot.heroImg
    addItem({
      id: lot.slug,
      name: lot.shortTitle,
      price: unitPrice,
      quantity: lot.minOrder,
      image: img,
      unit: lot.unit,
    })
    trackPixelEvent('AddToCart', {
      content_name: lot.title,
      content_ids: [lot.slug],
      content_type: 'product',
      value: unitPrice * lot.minOrder,
      currency: 'XOF',
    })
    setAdded({ name: lot.shortTitle, img })
  }

  return (
    <section ref={sectionRef} className="cs" id="lots">
      <div className="cs-wrap">
        <div className="cs-head cs-fu">
          <span className="cs-eyebrow">✦ Nos produits</span>
          <h2 className="cs-title">Emballages en gros au meilleur prix</h2>
          <p className="cs-sub">Commande à partir de 50 pièces — ajoutez directement au panier.</p>
        </div>

        <div className="cs-grid">
          {lots.map((lot) => {
            const unitPrice = getPriceForQty(lot, lot.minOrder)
            const totalReal = Math.round(unitPrice * lot.minOrder)
            const totalOld = Math.round(lot.basePrice * lot.minOrder)
            const discountPct = Math.round((1 - unitPrice / lot.basePrice) * 100)

            return (
              <div key={lot.slug} className="cs-card cs-fu" style={{ ['--ac' as any]: lot.accent }}>
                <Link href={`/lots/${lot.slug}`} className="cs-card-imgwrap">
                  <img src={SLIDER_IMAGES[lot.slug] ?? lot.heroImg} alt={lot.title} loading="lazy" />
                  {discountPct > 0 && <span className="cs-discount-badge">-{discountPct}%</span>}
                </Link>

                <div className="cs-card-body">
                  <Link href={`/lots/${lot.slug}`} className="cs-card-title">{lot.shortTitle}</Link>
                  <p className="cs-card-desc">{lot.description}</p>

                  <div className="cs-card-price">
                    <span className="cs-price-old">{fmt(totalOld)} FCFA</span>
                    <span className="cs-price-new">{fmt(totalReal)} FCFA</span>
                  </div>
                  <span className="cs-price-note">les {fmt(lot.minOrder)} {lot.unit}</span>

                  <div className="cs-card-actions">
                    <Link href={`/lots/${lot.slug}`} className="cs-btn-view">Voir le produit</Link>
                    <button type="button" className="cs-btn-cart" onClick={() => handleAddToCart(lot)}>
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {added && (
        <div className="cs-modal-overlay" onClick={() => setAdded(null)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="cs-modal-close" onClick={() => setAdded(null)} aria-label="Fermer">×</button>
            <img src={added.img} alt={added.name} className="cs-modal-img" />
            <span className="cs-modal-check">✓ Ajouté au panier</span>
            <h3 className="cs-modal-title">{added.name}</h3>
            <Link href="/panier" className="cs-modal-btn-primary">Passer à la commande</Link>
            <button type="button" className="cs-modal-btn-secondary" onClick={() => setAdded(null)}>
              Continuer mes achats
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cs {
          position: relative;
          padding: 96px 24px 32px;
          background: #F8F5EF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          scroll-margin-top: 90px;
        }
        .cs-wrap { max-width: 1240px; margin: 0 auto; }

        .cs-head { text-align: center; max-width: 620px; margin: 0 auto 48px; }
        .cs-eyebrow {
          display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #C8843A; margin-bottom: 14px;
        }
        .cs-title {
          font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; color: #111827; margin: 0 0 12px; line-height: 1.15;
        }
        .cs-sub { font-size: 15px; color: #6B7280; margin: 0; }

        .cs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }

        .cs-card {
          background: #ffffff; border: 1.5px solid #ECE6DA; border-radius: 16px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cs-card:hover { transform: translateY(-5px); box-shadow: 0 16px 32px rgba(0,0,0,0.08); }

        .cs-card-imgwrap {
          position: relative; display: block; aspect-ratio: 1 / 1;
          background: #FAFAF7; overflow: hidden;
        }
        .cs-card-imgwrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cs-discount-badge {
          position: absolute; top: 10px; left: 10px;
          background: #E53935; color: white; font-size: 11.5px; font-weight: 800;
          padding: 4px 10px; border-radius: 100px;
        }

        .cs-card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
        .cs-card-title {
          font-size: 14.5px; font-weight: 800; color: #111827; text-decoration: none;
          margin-bottom: 6px; display: block;
        }
        .cs-card-title:hover { color: var(--ac); }
        .cs-card-desc {
          font-size: 12px; color: #6B7280; line-height: 1.5; margin: 0 0 12px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .cs-card-price { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .cs-price-old { font-size: 12.5px; color: #A8A8A8; text-decoration: line-through; }
        .cs-price-new { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 800; color: var(--ac); }
        .cs-price-note { font-size: 11px; color: #9CA3AF; margin-bottom: 14px; }

        .cs-card-actions { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
        .cs-btn-view {
          text-align: center; font-size: 12.5px; font-weight: 700; color: var(--ac);
          border: 1.5px solid var(--ac); border-radius: 9px; padding: 9px; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .cs-btn-view:hover { background: var(--ac); color: white; }
        .cs-btn-cart {
          font-size: 12.5px; font-weight: 700; color: white; background: var(--ac);
          border: none; border-radius: 9px; padding: 10px; cursor: pointer;
          transition: filter 0.2s;
        }
        .cs-btn-cart:hover { filter: brightness(0.9); }

        /* Modale "ajouté au panier" */
        .cs-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(20,13,8,0.55); backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .cs-modal {
          position: relative; width: 100%; max-width: 360px;
          background: white; border-radius: 20px; padding: 32px 26px;
          text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .cs-modal-close {
          position: absolute; top: 12px; right: 12px;
          width: 30px; height: 30px; border-radius: 50%; border: none;
          background: #F4F4F4; color: #666; font-size: 17px; cursor: pointer;
        }
        .cs-modal-img {
          width: 72px; height: 72px; object-fit: cover; border-radius: 14px;
          margin: 0 auto 14px; display: block; border: 1px solid #ECE6DA;
        }
        .cs-modal-check { display: block; font-size: 12.5px; font-weight: 800; color: #1A5C38; margin-bottom: 6px; }
        .cs-modal-title { font-size: 17px; font-weight: 800; color: #111827; margin: 0 0 22px; }
        .cs-modal-btn-primary {
          display: block; background: #C8843A; color: white; font-weight: 700; font-size: 14px;
          padding: 13px; border-radius: 11px; text-decoration: none; margin-bottom: 10px;
        }
        .cs-modal-btn-secondary {
          background: none; border: none; color: #6B7280; font-size: 13px; font-weight: 600;
          cursor: pointer; text-decoration: underline;
        }

        /* Animation d'entrée */
        .cs-fu { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .cs-in { opacity: 1; transform: translateY(0); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .cs-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .cs-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .cs { padding: 64px 16px 24px; }
          .cs-head { margin-bottom: 36px; }
          .cs-card-body { padding: 12px; }
          .cs-card-title { font-size: 13px; }
          .cs-price-new { font-size: 16px; }
        }
        @media (max-width: 420px) {
          .cs-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-fu, .cs-card { transition: none !important; }
          .cs-fu { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}