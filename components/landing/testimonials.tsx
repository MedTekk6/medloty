'use client'

import { useEffect, useRef } from 'react'

const testimonials = [
  {
    name: 'Ousmane Sarr',
    role: 'Organisateur Magal · Touba',
    content: "Pour le Magal, j'ai commandé plusieurs lots de barquettes Lakh pour distribuer les repas. Prix de gros vraiment avantageux dès 50 pièces, ça m'a permis de tenir mon budget. Livraison reçue à temps à Touba.",
    rating: 5,
    accent: '#1A5C38',
    accentLight: '#EDFBF3',
  },
  {
    name: 'Aminata Mbaye',
    role: 'Grossiste · Marché Sandaga · Dakar',
    content: "Je revends des sacs kraft au marché. Je commande régulièrement, le prix de gros dès 50 pièces est vraiment intéressant comparé à ce que je trouvais avant. Qualité fiable, aucun souci jusqu'ici.",
    rating: 5,
    accent: '#C8843A',
    accentLight: '#FDF6EE',
  },
  {
    name: 'Mamadou Diop',
    role: 'Organisateur conférence · Ziguinchor',
    content: "Pour notre conférence régionale, j'ai pris des gobelets 4oz pour les pauses café. Commande simple sur le site dès 50 pièces, livraison rapide même jusqu'à Ziguinchor.",
    rating: 5,
    accent: '#2E7D32',
    accentLight: '#EDF7EE',
  },
]

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.ti').forEach((el, i) => {
              setTimeout(() => el.classList.add('ti-in'), i * 120)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="ts">

      <div className="ts-orb ts-orb1" aria-hidden="true" />
      <div className="ts-orb ts-orb2" aria-hidden="true" />

      <div className="ts-wrap">

        {/* EN-TÊTE */}
        <div className="ti ts-head">
          <span className="ts-eyebrow">✦ Avis clients</span>
          <p className="ts-sub">Ils commandent chez nous</p>
          <div className="ts-sep">
            <span className="ts-sep-line" />
            <span className="ts-sep-star">✦</span>
            <span className="ts-sep-line" />
          </div>
        </div>

        {/* CARTES */}
        <div className="ts-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="ti tc"
              style={{
                '--ac': t.accent,
                '--al': t.accentLight,
                '--delay': `${0.1 + i * 0.12}s`,
              } as React.CSSProperties}
            >
              {/* Guillemet décoratif */}
              <div className="tc-quote" aria-hidden="true">"</div>

              {/* Étoiles */}
              <div className="tc-stars" aria-label={`${t.rating} étoiles sur 5`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"/>
                  </svg>
                ))}
              </div>

              {/* Texte */}
              <p className="tc-text">"{t.content}"</p>

              {/* Auteur */}
              <div className="tc-author">
                <div className="tc-avatar">
                  <span className="tc-initials">{getInitials(t.name)}</span>
                  <div className="tc-ring" />
                </div>
                <div className="tc-info">
                  <span className="tc-name">{t.name}</span>
                  <span className="tc-role">{t.role}</span>
                </div>
                <div className="tc-verified" title="Achat vérifié">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" fill="#1A5C38" opacity="0.12"/>
                    <path d="M4.5 7l2 2 3-3" stroke="#1A5C38" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Vérifié</span>
                </div>
              </div>

              {/* Barre accent bas */}
              <div className="tc-bar" />
            </div>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="ti ts-stats">
          {[
            { val: '500+', label: 'Commandes livrées' },
            { val: '4.9/5', label: 'Note moyenne' },
            { val: 'Sénégal', label: 'Livraison partout' },
          ].map(s => (
            <div key={s.label} className="ts-stat">
              <span className="ts-stat-val">{s.val}</span>
              <span className="ts-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── SECTION ── */
        .ts {
          position: relative; padding: 96px 0 80px;
          background: #F8F5EF;
          font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden;
        }
        .ts-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.14; pointer-events: none; z-index: 0; }
        .ts-orb1 { width: 500px; height: 500px; background: radial-gradient(circle, #1A5C38, transparent 70%); top: -150px; left: -150px; }
        .ts-orb2 { width: 400px; height: 400px; background: radial-gradient(circle, #C8843A, transparent 70%); bottom: -100px; right: -100px; }

        .ts-wrap { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; padding: 0 24px; }

        /* ── HEADER ── */
        .ts-head {
          text-align: center;
          margin: 0 auto 56px;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ts-eyebrow {
          display: inline-block; font-size: 11px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: #C8843A; background: #FDF6EE;
          border: 1.5px solid #E8C990; padding: 5px 16px;
          border-radius: 100px; margin-bottom: 24px;
        }

        .ts-sub { font-size: 16px; color: #5A6A5A; margin: 0 0 28px; font-weight: 500; text-align: center; }
        .ts-sep { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
        .ts-sep-line { width: 60px; height: 1.5px; background: linear-gradient(90deg, transparent, #C8843A, transparent); display: block; }
        .ts-sep-star { color: #1A5C38; font-size: 14px; }

        /* ── ANIMATION ── */
        .ti { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); transition-delay: var(--delay, 0s); }
        .ti-in { opacity: 1 !important; transform: translateY(0) !important; }

        /* ── GRILLE ── */
        .ts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        /* ── CARTE ── */
        .tc {
          position: relative; background: white; border-radius: 20px;
          border: 1.5px solid #E8E0D5; box-shadow: 0 2px 12px rgba(26,92,56,0.05);
          padding: 28px 24px 0; display: flex; flex-direction: column;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s, border-color 0.4s;
        }
        .tc:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 24px 56px rgba(26,92,56,0.11), 0 4px 16px rgba(200,132,58,0.08); border-color: var(--ac); }

        .tc-quote {
          font-family: 'Playfair Display', serif; font-size: 80px; font-weight: 900;
          color: var(--ac); opacity: 0.08; line-height: 0.7; margin-bottom: 12px;
          user-select: none; pointer-events: none;
        }
        .tc-stars { display: flex; gap: 3px; color: #C8843A; margin-bottom: 16px; }
        .tc-stars svg { width: 15px; height: 15px; }
        .tc-text { font-size: 13.5px; color: #5A6A5A; line-height: 1.8; font-style: italic; margin: 0 0 20px; flex: 1; }

        /* Auteur */
        .tc-author {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 0 20px; border-top: 1.5px solid #F0E8DC;
        }
        .tc-avatar { position: relative; flex-shrink: 0; width: 46px; height: 46px; }
        .tc-initials {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ac), color-mix(in srgb, var(--ac) 70%, black));
          color: white; font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 900; letter-spacing: -0.5px; z-index: 2;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--ac) 35%, transparent);
        }
        .tc-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid var(--ac); opacity: 0.25;
          animation: avatarPulse 3s ease-in-out infinite;
        }
        @keyframes avatarPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50%       { transform: scale(1.12); opacity: 0.5; }
        }
        .tc:hover .tc-ring { opacity: 0.55; }
        .tc-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .tc-name { font-size: 14px; font-weight: 800; color: #0F1A0F; line-height: 1.2; }
        .tc-role { font-size: 11.5px; color: #9CA3AF; font-weight: 500; }

        /* Badge vérifié */
        .tc-verified {
          display: flex; align-items: center; gap: 3px; flex-shrink: 0;
          font-size: 10px; font-weight: 700; color: #1A5C38;
          background: #EDFBF3; border: 1px solid #A8EDCA;
          padding: 3px 8px; border-radius: 100px;
        }

        /* Barre bas */
        .tc-bar { height: 3px; background: linear-gradient(90deg, var(--ac), #C8843A, var(--ac)); background-size: 200% 100%; opacity: 0; transition: opacity 0.4s; animation: barShine 2.5s linear infinite; }
        .tc:hover .tc-bar { opacity: 1; }
        @keyframes barShine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── STATS FOOTER ── */
        .ts-stats {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-top: 52px;
          background: white; border: 1.5px solid #E8E0D5; border-radius: 20px;
          padding: 28px 32px; box-shadow: 0 2px 16px rgba(26,92,56,0.06);
          flex-wrap: wrap;
        }
        .ts-stat {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 0 40px; border-right: 1px solid #EDE5D8;
          flex: 1; min-width: 120px;
        }
        .ts-stat:last-child { border-right: none; }
        .ts-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 900; color: #1A5C38; line-height: 1;
        }
        .ts-stat-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) { .ts-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }

        @media (max-width: 640px) {
          .ts { padding: 64px 0 56px; }
          .ts-grid { grid-template-columns: 1fr; gap: 16px; }
          .tc { padding: 22px 18px 0; }
          .tc-text { font-size: 13px; }
          .ts-head { margin-bottom: 40px; }
          .ts-sub { font-size: 14px; margin-bottom: 22px; }
          .ts-stats { padding: 20px 16px; gap: 16px; }
          .ts-stat { padding: 0 16px; border-right: none; border-bottom: 1px solid #EDE5D8; padding-bottom: 16px; }
          .ts-stat:last-child { border-bottom: none; padding-bottom: 0; }
          .ts-stat-val { font-size: 26px; }
        }

        @media (max-width: 400px) {
          .ts-wrap { padding: 0 14px; }
          .tc { padding: 18px 14px 0; }
          .tc-text { font-size: 12px; }
          .tc-verified span { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ti, .tc { transition: none !important; }
          @keyframes avatarPulse { 0%,100% { transform: scale(1); opacity: 0.25; } }
          @keyframes barShine { 0%,100% { background-position: 0 0; } }
          @keyframes logoRing { 0%,100% { transform: scale(1); opacity: 0.3; } }
        }
      `}</style>
    </section>
  )
}