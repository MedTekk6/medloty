'use client'

import { useState, useEffect, useRef } from 'react'
import { submitForm } from '@/lib/formspree'
import toast from 'react-hot-toast'

export function Cta() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('in'), i * 100)
            })
          }
        })
      },
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await submitForm({
      _subject: `Nouveau message MedLoty — ${formData.name}`,
      nom: formData.name,
      email: formData.email,
      telephone: formData.phone || 'Non renseigné',
      message: formData.message,
    })
    setIsSubmitting(false)

    if (res.ok) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 3000)
    } else {
      toast.error(res.error || "Échec de l'envoi, réessayez")
    }
  }

  return (
    <section ref={sectionRef} className="ct">

      <div className="ct-orb ct-orb1" aria-hidden="true" />
      <div className="ct-orb ct-orb2" aria-hidden="true" />

      <div className="ct-wrap">

        {/* EN-TÊTE */}
        <div className="fu ct-head">
          <span className="ct-eyebrow">✦ Contact</span>
          <h2 className="ct-title">
            Envoyez-nous un <em className="ct-em">message</em>
          </h2>
        </div>

        {/* FORMULAIRE */}
        <div className="fu ct-form-wrap">
          <form onSubmit={handleSubmit} className="ct-form">
            {isSubmitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">🎉</div>
                <h3 className="ct-success-title">Merci {formData.name} !</h3>
                <p className="ct-success-text">Votre message a bien été reçu. Nous vous répondrons très vite.</p>
              </div>
            ) : (
              <>
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Nom complet *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Ousmane Sarr" required className="ct-input"
                    />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Email *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="exemple@email.com" required className="ct-input"
                    />
                  </div>
                </div>

                <div className="ct-field ct-field-full">
                  <label className="ct-label">Téléphone</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="77 123 45 67" className="ct-input"
                  />
                </div>

                <div className="ct-field ct-field-full">
                  <label className="ct-label">Message *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange}
                    placeholder="Décrivez votre besoin..." rows={4} required className="ct-textarea"
                  />
                </div>

                <button type="submit" className="ct-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;0,900;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── SECTION ── */
        .ct {
          position: relative;
          padding: 96px 0 80px;
          background: #F8F4EC;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }
        .ct-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.15; pointer-events: none; z-index: 0;
        }
        .ct-orb1 { width: 500px; height: 500px; background: radial-gradient(circle, #1A5C38, transparent 70%); top: -150px; right: -100px; }
        .ct-orb2 { width: 400px; height: 400px; background: radial-gradient(circle, #C8843A, transparent 70%); bottom: -100px; left: -100px; }

        .ct-wrap {
          position: relative; z-index: 1;
          max-width: 720px; width: 100%;
          margin: 0 auto; padding: 0 24px;
          box-sizing: border-box;
        }

        /* ── HEADER ── */
        .ct-head {
          text-align: center; margin: 0 auto 40px;
          display: flex; flex-direction: column; align-items: center;
          width: 100%;
        }
        .ct-eyebrow {
          display: inline-block; font-size: 11px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: #1A5C38; background: #EDFBF3;
          border: 1.5px solid #A8EDCA; padding: 5px 16px;
          border-radius: 100px; margin-bottom: 20px;
        }
        .ct-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4.5vw, 44px); font-weight: 900;
          color: #0F1A0F; margin: 0 0 14px;
          letter-spacing: -1px; line-height: 1.15;
        }
        .ct-em { color: #C8843A; font-style: italic; }
        .ct-sub {
          font-size: 15px; color: #5A6A5A; max-width: 460px;
          margin: 0 auto; line-height: 1.7; font-weight: 500;
        }

        /* ── ANIMATION ── */
        .fu { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .fu.in { opacity: 1 !important; transform: translateY(0) !important; }

        /* ── FORM WRAP ── */
        .ct-form-wrap { width: 100%; }

        /* ── FORM ── */
        .ct-form {
          background: white;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 8px 32px rgba(26,92,56,0.08);
          border: 1.5px solid #E8E0D5;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }

        /* Grille 2 colonnes (nom / email) */
        .ct-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .ct-field { display: flex; flex-direction: column; min-width: 0; }
        .ct-field-full { margin-bottom: 16px; }
        .ct-field-full:last-of-type { margin-bottom: 0; }

        .ct-label {
          font-size: 12.5px; font-weight: 700; color: #3D4D3D;
          margin-bottom: 6px; letter-spacing: 0.2px;
        }

        .ct-input, .ct-textarea {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1.8px solid #E5DDD0;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1f2937;
          outline: none;
          background: #FAFAF7;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: #B0A898; }
        .ct-input:focus, .ct-textarea:focus {
          border-color: #1A5C38;
          box-shadow: 0 0 0 4px rgba(26,92,56,0.10);
          background: white;
        }
        .ct-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

        /* ── SUBMIT ── */
        .ct-submit {
          width: 100%;
          margin-top: 20px;
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #1A5C38, #0F3D25);
          color: white;
          padding: 14px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 14.5px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.3px;
          box-shadow: 0 6px 22px rgba(26,92,56,0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ct-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(26,92,56,0.36);
        }
        .ct-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .ct-submit svg { transition: transform 0.25s; }
        .ct-submit:hover svg { transform: translateX(3px); }

        /* ── SUCCESS STATE ── */
        .ct-success {
          text-align: center;
          padding: 32px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .ct-success-icon { font-size: 48px; line-height: 1; margin-bottom: 4px; }
        .ct-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 800; color: #1A5C38; margin: 0;
        }
        .ct-success-text { color: #6B7280; font-size: 14px; margin: 0; max-width: 320px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .ct { padding: 64px 0 56px; }
          .ct-wrap { padding: 0 18px; }
          .ct-form { padding: 24px 20px; border-radius: 20px; }
          .ct-row { grid-template-columns: 1fr; gap: 14px; margin-bottom: 14px; }
          .ct-title { font-size: clamp(24px, 7vw, 34px); }
          .ct-sub { font-size: 14px; }
          .ct-head { margin-bottom: 32px; }
        }

        @media (max-width: 400px) {
          .ct-wrap { padding: 0 14px; }
          .ct-form { padding: 20px 16px; }
          .ct-input, .ct-textarea { padding: 10px 12px; font-size: 13.5px; }
          .ct-submit { font-size: 13.5px; padding: 13px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fu, .ct-submit { transition: none !important; }
        }
      `}</style>
    </section>
  )
}