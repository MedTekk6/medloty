'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/context/cart-context'
import { SLIDER_IMAGES } from '@/data/lots'

const lots = [
  { href: '/lots/gobelets-4oz',                label: 'Gobelets 4oz',           img: SLIDER_IMAGES['gobelets-4oz'],            num: '01', accent: '#1A5C38', keywords: 'gobelet gobelets 4oz carton kraft cafe touba eau' },
  { href: '/lots/gobelets-8oz',                  label: 'Gobelets 8oz',           img: SLIDER_IMAGES['gobelets-8oz'],           num: '02', accent: '#4A7C59', keywords: 'gobelet gobelets 8oz boisson fraiche jus soda the glace' },
  { href: '/lots/gobelets-14oz-cocktail',      label: 'Gobelets 14oz Cocktail', img: SLIDER_IMAGES['gobelets-14oz-cocktail'],  num: '03', accent: '#2E7D32', keywords: 'gobelet gobelets 14oz cocktail jus fruit motif' },
  { href: '/lots/gobelets-14oz',               label: 'Gobelets 14oz',          img: SLIDER_IMAGES['gobelets-14oz'],           num: '04', accent: '#C8843A', keywords: 'gobelet gobelets 14oz jus dessert glace milkshake' },
  { href: '/lots/pailles',                     label: 'Pailles',                img: SLIDER_IMAGES['pailles'],                 num: '05', accent: '#8B5A1A', keywords: 'paille pailles boisson jus' },
  { href: '/lots/sacs-craft',                  label: 'Sacs Kraft',             img: SLIDER_IMAGES['sacs-craft'],              num: '06', accent: '#A0522D', keywords: 'sac sacs craft papier kraft boutique cadeau' },
  { href: '/lots/sac-non-tisse-bretelle-simple', label: 'Sac Bretelle Simple',    img: SLIDER_IMAGES['sac-non-tisse-bretelle-simple'], num: '07', accent: '#4E6B8E', keywords: 'sac non tisse bretelle simple cadeau client' },
  { href: '/lots/barquettes-lakh',             label: 'Barquettes Lakh',        img: SLIDER_IMAGES['barquettes-lakh'],         num: '08', accent: '#6B4226', keywords: 'barquette barquettes noire lakh plat restauration' },
  { href: '/lots/barquettes-aluminium-s800',   label: 'Barquettes Alu S800',    img: SLIDER_IMAGES['barquettes-aluminium-s800'], num: '09', accent: '#3A7D44', keywords: 'barquette aluminium s800 chaud livraison' },
  { href: '/lots/barquette-alu-18',             label: 'Barquette Alu 18',        img: SLIDER_IMAGES['barquette-alu-18'],       num: '10', accent: '#2F6B6B', keywords: 'barquette aluminium 18 chaud livraison' },
  { href: '/lots/cuilleres',                    label: 'Cuillères',              img: SLIDER_IMAGES['cuilleres'],              num: '11', accent: '#7A4B2E', keywords: 'cuillere cuilleres lakh soupe dessert' },
  { href: '/lots/serviettes-papier-30x30',       label: 'Serviettes Papier',      img: SLIDER_IMAGES['serviettes-papier-30x30'], num: '12', accent: '#8C7A5C', keywords: 'serviette serviettes papier blanc 1 pli 30x30' },
]

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const formatCount = (n: number) => {
  if (n < 1000) return String(n)
  const k = n / 1000
  const rounded = Math.round(k * 10) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k`
}

// Icône panier "chariot" — plus reconnaissable et plus proche des grands
// sites e-commerce (Alibaba, Amazon...) qu'un simple contour de sac.
const CartIcon = () => (
  <svg viewBox="0 0 576 512" className="h-cart-icon" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
  </svg>
)

export function SiteHeader() {
  const router                            = useRouter()
  const pathname                          = usePathname()

  // Défilement fiable vers une section de l'accueil : si on y est déjà, on
  // scrolle nous-mêmes en JS (évite les soucis de Next.js Link + ancre sur
  // la même page) ; sinon on navigue vers l'accueil avec le hash dans l'URL,
  // et un effet dans HomeClient se charge de scroller une fois la page montée.
  const goToSection = (e: React.MouseEvent, id: string) => {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    closeMobileMenu()
  }
  const [scrolled, setScrolled]           = useState(false)
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [lotsOpen, setLotsOpen]           = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery]     = useState('')
  const dropRef                           = useRef<HTMLDivElement>(null)
  const searchRef                         = useRef<HTMLFormElement>(null)
  const cartCount                         = useCart().totalItems
  const [cartBump, setCartBump]           = useState(false)
  const prevCartCount                     = useRef(cartCount)

  useEffect(() => {
    if (cartCount !== prevCartCount.current) {
      setCartBump(true)
      const t = setTimeout(() => setCartBump(false), 450)
      prevCartCount.current = cartCount
      return () => clearTimeout(t)
    }
  }, [cartCount])

  const searchResults = searchQuery.trim()
    ? lots.filter(l => {
        const q = normalize(searchQuery)
        return normalize(l.label).includes(q) || normalize(l.keywords).includes(q)
      })
    : []
  const showResults = searchFocused && searchQuery.trim().length > 0

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setLotsOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const goToLot = (href: string) => {
    setSearchQuery('')
    setSearchFocused(false)
    router.push(href)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setSearchFocused(false)
    setSearchQuery('')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) goToLot(searchResults[0].href)
  }

  return (
    <>
      <header className={`h${scrolled ? ' hs' : ''}`}>

        {/* LOGO — gauche absolue */}
        <Link href="/" className="h-logo" onClick={closeMobileMenu}>
          <Image src="/assets/logo.webp" alt="MedLoty" width={36} height={36} style={{ objectFit: 'contain' }} priority />
          <span className="h-logo-text">Med<span className="h-logo-k">Loty</span></span>
        </Link>

        {/* CENTRE — nav + recherche */}
        <div className="h-center">
          <nav className="h-nav">
            <Link href="/" className="h-link">Accueil</Link>

            <div ref={dropRef} className="h-drop-wrap">
              <button
                className={`h-link h-drop-btn${lotsOpen ? ' h-drop-open' : ''}`}
                onClick={() => setLotsOpen(!lotsOpen)}
                aria-expanded={lotsOpen}
              >
                Nos lots
                <svg className={`h-chev${lotsOpen ? ' h-chev-r' : ''}`} width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {lotsOpen && (
                <div className="h-dd">
                  <div className="h-dd-head">
                    <span className="h-dd-title">Nos produits · Gros & détail</span>
                    <span className="h-dd-sub">Livraison partout au Sénégal</span>
                  </div>
                  <div className="h-dd-grid">
                    {lots.map(l => (
                      <Link key={l.href} href={l.href} className="h-dd-item"
                        style={{ '--a': l.accent } as React.CSSProperties}
                        onClick={() => setLotsOpen(false)}>
                        <span className="h-dd-thumb">
                          <Image src={l.img} alt={l.label} fill style={{ objectFit: 'contain' }} sizes="30px" />
                        </span>
                        <span className="h-dd-label">{l.label}</span>
                        <span className="h-dd-num">{l.num}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/#lots" className="h-dd-foot" onClick={(e) => { goToSection(e, 'lots'); setLotsOpen(false) }}>
                    Voir tous les lots →
                  </Link>
                </div>
              )}
            </div>

            <Link href="/#sur-mesure" onClick={(e) => goToSection(e, 'sur-mesure')} className="h-link">Sur Mesure</Link>
            <Link href="/liquidation" className="h-link">Lots à liquider</Link>

          </nav>

          <form ref={searchRef} className={`h-search${searchFocused ? ' h-sf' : ''}`} onSubmit={handleSearch}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-s-ico">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              type="search" className="h-s-inp"
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              aria-label="Rechercher"
            />
            {searchQuery && (
              <button type="submit" className="h-s-btn">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {showResults && (
              <div className="h-s-dd">
                {searchResults.length > 0 ? (
                  searchResults.map(l => (
                    <button
                      key={l.href}
                      type="button"
                      className="h-s-dd-item"
                      onClick={() => goToLot(l.href)}
                    >
                      <span className="h-s-dd-thumb">
                        <Image src={l.img} alt={l.label} fill style={{ objectFit: 'contain' }} sizes="28px" />
                      </span>
                      <span className="h-s-dd-label">{l.label}</span>
                      <span className="h-s-dd-num">{l.num}</span>
                    </button>
                  ))
                ) : (
                  <div className="h-s-dd-empty">Aucun lot ne correspond à « {searchQuery} »</div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* DROITE — panier (toujours visible) + burger (mobile) */}
        <div className="h-right">
          <Link href="/panier" className={`h-cart${cartBump ? ' h-cart-bump' : ''}`} aria-label="Panier">
            <CartIcon />
            {cartCount > 0 && <span className={`h-badge${cartBump ? ' h-badge-bump' : ''}`}>{formatCount(cartCount)}</span>}
          </Link>

          {/* Burger mobile */}
          <button
            className={`h-burger${mobileOpen ? ' h-burger-x' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div className={`h-mob${mobileOpen ? ' h-mob-open' : ''}`}>
        <nav className="h-mob-nav">

          <Link href="/" className="h-mob-link" onClick={closeMobileMenu}>Accueil</Link>
          <Link href="/#sur-mesure" onClick={(e) => goToSection(e, 'sur-mesure')} className="h-mob-link">Sur Mesure</Link>
          <Link href="/liquidation" className="h-mob-link" onClick={closeMobileMenu}>Lots à liquider</Link>

          <div className="h-mob-sec">
            <span className="h-mob-sec-lbl">✦ Nos lots</span>
            <div className="h-mob-lots">
              {lots.map(l => (
                <Link key={l.href} href={l.href} className="h-mob-lot"
                  style={{ '--a': l.accent } as React.CSSProperties}
                  onClick={closeMobileMenu}>
                  <span className="h-mob-thumb">
                    <Image src={l.img} alt={l.label} fill style={{ objectFit: 'contain' }} sizes="28px" />
                  </span>
                  <span>{l.label}</span>
                  <span className="h-mob-lot-n">{l.num}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Panier dans le burger sur mobile */}
          <Link href="/panier" className="h-mob-cart" onClick={closeMobileMenu}>
            <CartIcon />
            Mon panier{cartCount > 0 ? ` (${formatCount(cartCount)})` : ''}
          </Link>
        </nav>
      </div>

      {mobileOpen && <div className="h-overlay" onClick={closeMobileMenu} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── HEADER ── */
        .h {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          background: rgba(248,244,236,0.96);
          border-bottom: 1.5px solid #E8E0D5;
          backdrop-filter: blur(14px);
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: box-shadow 0.3s;
          gap: 16px;
        }
        .hs { box-shadow: 0 4px 24px rgba(26,92,56,0.10); background: rgba(248,244,236,0.99); }

        /* LOGO */
        .h-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
        }
        .h-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 21px; font-weight: 900; color: #1A5C38;
          letter-spacing: -0.5px; line-height: 1; white-space: nowrap;
        }
        .h-logo-k { color: #C8843A; }

        /* CENTRE */
        .h-center {
          display: flex; align-items: center; gap: 8px;
          flex: 1; justify-content: center;
        }

        /* NAV */
        .h-nav { display: flex; align-items: center; gap: 2px; }
        .h-link {
          font-size: 13.5px; font-weight: 600; color: #4A5A4A;
          padding: 7px 11px; border-radius: 8px;
          text-decoration: none; white-space: nowrap;
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; align-items: center; gap: 4px;
          transition: color 0.2s, background 0.2s;
        }
        .h-link:hover, .h-drop-open { color: #1A5C38 !important; background: #EDFBF3 !important; }
        .h-drop-wrap { position: relative; }
        .h-chev { transition: transform 0.25s; opacity: 0.6; }
        .h-chev-r { transform: rotate(180deg); }

        /* DROPDOWN */
        .h-dd {
          position: absolute; top: calc(100% + 10px); left: 50%;
          transform: translateX(-50%);
          background: white; border: 1.5px solid #E8E0D5; border-radius: 16px;
          box-shadow: 0 16px 48px rgba(26,92,56,0.13), 0 4px 16px rgba(0,0,0,0.06);
          width: 360px; overflow: hidden;
          animation: ddIn 0.2s cubic-bezier(0.22,1,0.36,1);
          z-index: 200;
        }
        @keyframes ddIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .h-dd-head { padding: 14px 16px 10px; border-bottom: 1px solid #F0E8DC; background: #FAFAF7; }
        .h-dd-title { display: block; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #1A5C38; }
        .h-dd-sub { display: block; font-size: 11px; color: #9CA3AF; font-weight: 500; margin-top: 2px; }
        .h-dd-grid { padding: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .h-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 12px; border-radius: 10px;
          text-decoration: none; color: #3D4D3D;
          border: 1.5px solid transparent;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }
        .h-dd-item:hover {
          background: color-mix(in srgb, var(--a) 8%, white);
          border-color: color-mix(in srgb, var(--a) 25%, transparent);
          color: var(--a);
        }
        .h-dd-thumb {
          position: relative;
          width: 30px; height: 30px; flex-shrink: 0;
          background: color-mix(in srgb, var(--a) 10%, white);
          border-radius: 50%;
          padding: 4px;
          box-sizing: border-box;
        }
        .h-dd-label { font-size: 12.5px; font-weight: 700; flex: 1; }
        .h-dd-num { font-size: 10px; font-weight: 800; color: var(--a); opacity: 0.45; font-family: 'Playfair Display', serif; }
        .h-dd-foot {
          display: block; text-align: center; padding: 10px 16px;
          font-size: 12px; font-weight: 800; color: #1A5C38;
          background: #EDFBF3; text-decoration: none;
          border-top: 1px solid #D4EDDA; transition: background 0.2s;
        }
        .h-dd-foot:hover { background: #D4EDDA; }

        /* RECHERCHE */
        .h-search {
          position: relative;
          display: flex; align-items: center; gap: 7px;
          background: white; border: 1.5px solid #DDD6CC; border-radius: 100px;
          padding: 0 12px; height: 38px; width: 200px;
          transition: border-color 0.25s, box-shadow 0.25s, width 0.3s ease;
        }
        .h-sf { border-color: #1A5C38; box-shadow: 0 0 0 3px rgba(26,92,56,0.10); width: 240px; }
        .h-s-ico { color: #B0A898; flex-shrink: 0; transition: color 0.2s; }
        .h-sf .h-s-ico { color: #1A5C38; }
        .h-s-inp {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 13px; font-weight: 500; color: #2D3D2D;
          font-family: 'Plus Jakarta Sans', sans-serif; min-width: 0;
        }
        .h-s-inp::placeholder { color: #B0A898; }
        .h-s-inp::-webkit-search-cancel-button { display: none; }
        .h-s-btn {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 100px;
          background: #1A5C38; color: white; border: none; cursor: pointer;
          flex-shrink: 0; transition: background 0.2s;
        }
        .h-s-btn:hover { background: #0F3D25; }

        .h-s-dd {
          position: absolute; top: calc(100% + 10px); left: 0; right: 0;
          background: white; border-radius: 16px;
          border: 1.5px solid #EEE8DD;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          padding: 6px; z-index: 200;
          max-height: 320px; overflow-y: auto;
          scrollbar-width: none;
        }
        .h-s-dd::-webkit-scrollbar { display: none; }
        .h-s-dd-item {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 10px; border: none;
          background: none; cursor: pointer; text-align: left;
          transition: background 0.15s;
        }
        .h-s-dd-item:hover { background: #FAFAF7; }
        .h-s-dd-thumb {
          position: relative; width: 28px; height: 28px; flex-shrink: 0;
          background: #FAFAFA; border-radius: 7px; padding: 3px;
        }
        .h-s-dd-label { flex: 1; font-size: 13px; font-weight: 600; color: #2D3D2D; }
        .h-s-dd-num { font-size: 10px; font-weight: 800; color: #B0A898; }
        .h-s-dd-empty { padding: 14px 10px; font-size: 12.5px; color: #A8A8A8; text-align: center; }

        /* DROITE */
        .h-right {
          display: flex; align-items: center; gap: 4px;
          flex-shrink: 0;
          margin-left: auto;
        }

        /* PANIER — style "grand site e-commerce" : bouton avec fond/bordure,
           icône chariot pleine, badge rouge bien visible. */
        .h-cart {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 42px; height: 42px; border-radius: 12px;
          color: #1A5C38; text-decoration: none;
          background: #EDFBF3; border: 1.5px solid #D4EDDA;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .h-cart:hover {
          background: #1A5C38; border-color: #1A5C38; color: white;
          transform: translateY(-1px); box-shadow: 0 6px 16px rgba(26,92,56,0.25);
        }
        .h-cart-icon { width: 19px; height: 19px; fill: currentColor; }
        .h-badge {
          position: absolute; top: -6px; right: -6px;
          min-width: 19px; height: 19px;
          background: #E53935; color: white;
          font-size: 10px; font-weight: 800; border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px; border: 2.5px solid #F8F4EC;
          font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1;
          white-space: nowrap; box-shadow: 0 2px 6px rgba(229,57,53,0.4);
        }
        .h-cart-bump { animation: hCartBump 0.45s ease; }
        .h-badge-bump { animation: hBadgeBump 0.45s ease; }
        @keyframes hCartBump {
          0% { transform: scale(1); }
          35% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes hBadgeBump {
          0% { transform: scale(1); background: #E53935; }
          40% { transform: scale(1.45); background: #C8843A; }
          100% { transform: scale(1); background: #E53935; }
        }

        /* BURGER */
        .h-burger {
          display: none; flex-direction: column; gap: 5px;
          padding: 8px; background: none; border: none; cursor: pointer;
          border-radius: 8px; transition: background 0.2s;
        }
        .h-burger:hover { background: #EDFBF3; }
        .h-burger span {
          display: block; width: 22px; height: 2px;
          background: #2D3D2D; border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s; transform-origin: center;
        }
        .h-burger-x span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .h-burger-x span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .h-burger-x span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MENU MOBILE */
        .h-mob {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 90;
          background: #F8F4EC; border-bottom: 1.5px solid #E8E0D5;
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .h-mob-open { max-height: 85vh; overflow-y: auto; scrollbar-width: none; }
        .h-mob-open::-webkit-scrollbar { display: none; }
        .h-mob-nav { padding: 16px 20px 24px; display: flex; flex-direction: column; gap: 4px; }

        .h-mob-link {
          display: block; padding: 12px 4px;
          font-size: 15px; font-weight: 700; color: #2D3D2D;
          text-decoration: none; border-bottom: 1px solid #EDE5D8;
          transition: color 0.2s;
        }
        .h-mob-link:hover { color: #1A5C38; }

        .h-mob-sec { padding: 12px 0; border-bottom: 1px solid #EDE5D8; }
        .h-mob-sec-lbl {
          display: block; font-size: 10px; font-weight: 800;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #C8843A; margin-bottom: 10px; padding: 0 4px;
        }
        .h-mob-lots { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .h-mob-lot {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 11px; border-radius: 10px;
          border: 1.5px solid #E8E0D5; background: white;
          text-decoration: none; font-size: 12px; font-weight: 700; color: #3D4D3D;
          transition: border-color 0.2s, color 0.2s;
        }
        .h-mob-lot:hover { border-color: var(--a); color: var(--a); }
        .h-mob-thumb {
          position: relative;
          width: 28px; height: 28px; flex-shrink: 0;
          background: color-mix(in srgb, var(--a) 10%, white);
          border-radius: 50%;
          padding: 4px;
          box-sizing: border-box;
        }
        .h-mob-lot-n { margin-left: auto; font-size: 10px; font-weight: 800; color: var(--a); opacity: 0.4; font-family: 'Playfair Display', serif; }

        .h-mob-cart {
          display: flex; align-items: center; gap: 9px;
          margin: 14px 0 0; padding: 13px;
          background: linear-gradient(135deg, #1A5C38, #0F3D25);
          color: white; font-size: 14px; font-weight: 800;
          border-radius: 100px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(26,92,56,0.22);
          justify-content: center;
        }
        .h-mob-cart .h-cart-icon { width: 17px; height: 17px; fill: white; }

        .h-overlay {
          position: fixed; inset: 0; z-index: 80;
          background: rgba(15,26,15,0.25); backdrop-filter: blur(2px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1023px) {
          .h-nav { display: none; }
          .h-cart { width: 38px; height: 38px; }
          .h-burger {
            display: flex !important;
            flex-shrink: 0;
            z-index: 10;
          }
          .h { padding: 0 16px; gap: 10px; }
          .h-center { flex: 1; justify-content: flex-start; min-width: 0; }
          .h-search { width: 100%; max-width: 100%; flex: 1; padding: 0 10px; }
          .h-sf { width: 100%; }
        }

        @media (max-width: 480px) {
          .h-logo-text { font-size: 18px; }
          .h-mob-lots { grid-template-columns: 1fr; }
          .h-mob-nav { padding: 12px 14px 20px; }
          .h-s-dd {
            position: fixed;
            left: 16px; right: 16px;
            top: 68px;
            max-height: min(60vh, 360px);
          }
          .h-s-dd-item { padding: 11px 10px; }
        }

        @media (max-width: 360px) {
          .h { padding: 0 10px; gap: 8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .h-mob, .h-burger span, .h-dd, .h-cart-bump, .h-badge-bump { transition: none !important; animation: none !important; }
        }
      `}</style>
    </>
  )
}

export default SiteHeader