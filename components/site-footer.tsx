'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const lots = [
  { href: '/lots/gobelets-4oz',                    label: 'Gobelets 4oz' },
  { href: '/lots/gobelets-8oz',                    label: 'Gobelets 8oz' },
  { href: '/lots/gobelets-14oz-cocktail',          label: 'Gobelets 14oz Cocktail' },
  { href: '/lots/gobelets-14oz',                   label: 'Gobelets 14oz' },
  { href: '/lots/pailles',                         label: 'Pailles' },
  { href: '/lots/sacs-craft',                      label: 'Sacs Kraft' },
  { href: '/lots/sac-non-tisse-bretelle-simple',   label: 'Sac Bretelle Simple' },
  { href: '/lots/barquettes-lakh',                 label: 'Barquettes Lakh' },
  { href: '/lots/barquettes-aluminium-s800',       label: 'Barquettes Alu S800' },
  { href: '/lots/barquette-alu-18',                label: 'Barquette Alu 18' },
  { href: '/lots/cuilleres',                       label: 'Cuillères' },
  { href: '/lots/serviettes-papier-30x30',         label: 'Serviettes Papier' },
]

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/#lots', label: 'Nos lots' },
  { href: '/#sur-mesure', label: 'Sur Mesure' },
]

export function SiteFooter() {
  const pathname = usePathname()

  const goToSection = (e: React.MouseEvent, id: string) => {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="ft">
      <div className="ft-wrap">

        <div className="ft-grid">

          {/* ── COLONNE 1 : LOGO + DESCRIPTION ── */}
          <div className="ft-col ft-col-brand">
            <div className="ft-logo">
              <div className="ft-logo-img">
                <Image src="/assets/logo.webp" alt="MedLoty" width={44} height={44} style={{ objectFit: 'contain' }} />
              </div>
              <span className="ft-logo-text">
                Med<span className="ft-logo-kraft">Loty</span>
              </span>
            </div>

            <p className="ft-desc">
              Emballages alimentaires en gros et au détail. Gobelets, sacs kraft, barquettes — commande dès 50 pièces, stock disponible partout au Sénégal.
            </p>
            <p className="ft-legal-note">
              MedLoty — société basée à Casablanca, Zone Industrielle Lissasfa (Maroc). Stock disponible au Sénégal, accessible via commande sur le site.
            </p>

            <div className="ft-social">
              <a href="https://www.facebook.com/medloty" target="_blank" rel="noopener noreferrer" aria-label="MedLoty sur Facebook" className="ft-social-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>
              </a>
              <a href="https://www.instagram.com/medloty/" target="_blank" rel="noopener noreferrer" aria-label="MedLoty sur Instagram" className="ft-social-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.02-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* ── COLONNE 2 : NAVIGATION (aligné navbar) ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">Navigation</h4>
            <ul className="ft-list">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="ft-link"
                    onClick={item.href.includes('#') ? (e) => goToSection(e, item.href.split('#')[1]) : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLONNE 3 : NOS LOTS ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">Nos lots</h4>
            <ul className="ft-list">
              {lots.map((lot) => (
                <li key={lot.href}>
                  <Link href={lot.href} className="ft-link">{lot.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLONNE 4 : MEDLOTY ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">MedLoty</h4>
            <ul className="ft-list">
              <li><Link href="/#lots" onClick={(e) => goToSection(e, 'lots')} className="ft-link">Voir tous les lots</Link></li>
              <li><Link href="/panier" className="ft-link">Mon panier</Link></li>
            </ul>
          </div>
        </div>

        {/* ── BAS DE PAGE ── */}
        <div className="ft-bottom">
          <div className="ft-copy">© {currentYear} MedLoty · Sénégal</div>
          <div className="ft-legal">
            <Link href="#" className="ft-legal-link">CGV</Link>
            <Link href="#" className="ft-legal-link">Confidentialité</Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── FOOTER ── */
        .ft {
          background: #0A140A;
          color: #FFFFFF;
          padding: 64px 0 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ft-wrap { max-width: 1240px; margin: 0 auto; padding: 0 24px; width: 100%; box-sizing: border-box; }

        /* Grille */
        .ft-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .ft-col { min-width: 0; }

        /* Logo */
        .ft-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .ft-logo-img { width: 44px; height: 44px; position: relative; flex-shrink: 0; }
        .ft-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 800; color: #5EDB8A;
          letter-spacing: -0.5px;
        }
        .ft-logo-kraft { color: #C8843A; }

        .ft-desc {
          font-size: 13px; color: rgba(255,255,255,0.5);
          line-height: 1.8; margin-bottom: 0; max-width: 340px;
        }
        .ft-legal-note {
          font-size: 11.5px; color: rgba(255,255,255,0.32);
          line-height: 1.7; margin: 10px 0 0; max-width: 340px;
        }
        .ft-social { display: flex; gap: 10px; margin-top: 18px; }
        .ft-social-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .ft-social-btn:hover { background: #C8843A; color: #ffffff; transform: translateY(-2px); }

        /* Titres colonnes */
        .ft-col-title {
          font-size: 11px; font-weight: 800; letter-spacing: 1.8px;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 18px;
        }

        /* Listes */
        .ft-list { list-style: none; padding: 0; margin: 0; }
        .ft-link {
          display: block; font-size: 13px; color: rgba(255,255,255,0.55);
          margin-bottom: 11px; text-decoration: none;
          transition: color 0.2s, padding-left 0.2s, border-color 0.2s;
          padding-left: 0; border-left: 2px solid transparent;
        }
        .ft-link:hover {
          color: #FFFFFF; padding-left: 8px; border-left-color: #C8843A;
        }

        /* Bottom */
        .ft-bottom {
          border-top: 1.5px solid rgba(255,255,255,0.08);
          padding-top: 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .ft-copy { font-size: 12px; color: rgba(255,255,255,0.35); }
        .ft-legal { font-size: 12px; color: rgba(255,255,255,0.35); display: flex; gap: 16px; }
        .ft-legal-link { color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .ft-legal-link:hover { color: #FFFFFF; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ft-col-brand { grid-column: 1 / -1; }
        }

        @media (max-width: 640px) {
          .ft { padding: 48px 0 24px; }
          .ft-grid { grid-template-columns: 1fr; gap: 28px; }
          .ft-col-brand { grid-column: auto; }
          .ft-desc { max-width: 100%; }
          .ft-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
        }

        @media (max-width: 400px) {
          .ft-wrap { padding: 0 16px; }
        }
      `}</style>
    </footer>
  )
}