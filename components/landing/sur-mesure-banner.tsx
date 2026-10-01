'use client'

import { useEffect, useRef } from 'react'
import { trackPixelEvent } from '@/lib/meta-pixel'

const WHATSAPP_NUMBER = '212644261566'

export function SurMesureBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.smb-fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('smb-in'), i * 90)
            })
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const message = "Bonjour, je suis intéressé(e) par la personnalisation sur mesure (logo) de produits MedLoty. Pouvez-vous m'en dire plus ?"
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <section ref={sectionRef} className="smb" id="sur-mesure">
      <div className="smb-wrap">
        <div className="smb-visual smb-fu">
          <img src="/assets/surmesure.webp" alt="Personnalisation sur mesure MedLoty" />
        </div>

        <div className="smb-content smb-fu">
          <span className="smb-eyebrow">✦ Service sur mesure</span>
          <h2 className="smb-title">Ajoutez votre logo</h2>
          <p className="smb-desc">
            Personnalisez vos sacs ou gobelets avec votre propre logo. Service disponible à partir d'une
            commande minimum de <strong>1 000 pièces</strong>, avec un supplément de personnalisation de{' '}
            <strong>50 FCFA par unité</strong>.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="smb-btn"
            onClick={() => trackPixelEvent('Contact', { content_name: 'Sur Mesure — WhatsApp' })}
          >
            <svg viewBox="0 0 24 24" className="smb-btn-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Discuter de mon projet sur WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        .smb { padding: 80px 24px; background: #FAFAF9; scroll-margin-top: 90px; }
        .smb-wrap {
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
        }

        .smb-visual { border-radius: 22px; overflow: hidden; aspect-ratio: 4 / 3; }
        .smb-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .smb-eyebrow {
          display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #C8843A; margin-bottom: 14px;
        }
        .smb-title {
          font-family: 'Playfair Display', serif; font-size: clamp(26px, 3.6vw, 38px);
          font-weight: 800; color: #111827; margin: 0 0 14px; line-height: 1.15;
        }
        .smb-desc { font-size: 15px; color: #6B7280; line-height: 1.75; margin: 0 0 26px; }
        .smb-desc strong { color: #1A5C38; }

        .smb-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #25D366; color: white; font-weight: 700; font-size: 14.5px;
          padding: 13px 26px; border-radius: 12px; text-decoration: none;
          transition: background 0.2s;
        }
        .smb-btn:hover { background: #1FB855; }
        .smb-btn-icon { width: 19px; height: 19px; fill: white; flex-shrink: 0; }

        .smb-fu { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .smb-in { opacity: 1; transform: translateY(0); }

        @media (max-width: 780px) {
          .smb { padding: 56px 18px; }
          .smb-wrap { grid-template-columns: 1fr; gap: 26px; }
          .smb-visual { aspect-ratio: 16 / 9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .smb-fu { transition: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}