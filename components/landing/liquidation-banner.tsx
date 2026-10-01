'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export function LiquidationBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.liq-fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('liq-in'), i * 90)
            })
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="liq" id="liquidation">
      <div className="liq-wrap">
        <div className="liq-content liq-fu">
          <span className="liq-eyebrow">✦ Offre spéciale</span>
          <h2 className="liq-title">Lots à liquider — prix imbattables</h2>
          <p className="liq-desc">
            Accessoires, emballages, quincaillerie, vaisselle... à prix imbattables.
            Qualité, rapidité et petits prix garantis !
          </p>
          <Link href="/liquidation" className="liq-btn">
            Voir tous les lots à liquider
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .liq {
          padding: 64px 24px;
          background:
            linear-gradient(135deg, rgba(42,27,16,0.55) 0%, rgba(107,66,38,0.42) 55%, rgba(200,132,58,0.32) 100%),
            url('/assets/destockage.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          scroll-margin-top: 90px;
        }
        .liq-wrap { max-width: 900px; margin: 0 auto; text-align: center; }

        .liq-eyebrow {
          display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #F0DCC0; margin-bottom: 14px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }
        .liq-title {
          font-family: 'Playfair Display', serif; font-size: clamp(24px, 3.4vw, 36px);
          font-weight: 800; color: #ffffff; margin: 0 0 14px; line-height: 1.2;
          text-shadow: 0 3px 14px rgba(0,0,0,0.65);
        }
        .liq-desc {
          font-size: 15px; color: rgba(255,255,255,0.95); line-height: 1.7;
          max-width: 560px; margin: 0 auto 28px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
        }

        .liq-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: #6B4226; font-weight: 800; font-size: 14.5px;
          padding: 14px 28px; border-radius: 12px; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .liq-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.25); }

        .liq-fu { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .liq-in { opacity: 1; transform: translateY(0); }

        @media (max-width: 640px) {
          .liq { padding: 48px 18px; }
          .liq-desc { font-size: 13.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .liq-fu { transition: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}