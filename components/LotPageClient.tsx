'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Lot, getOtherLots, getPriceForQty, CUSTOMIZATION_SURCHARGE, CUSTOMIZATION_MIN_ORDER, SLIDER_IMAGES, WHOLESALE_DISCOUNT_PERCENT } from '@/data/lots'
import { useCart } from '@/context/cart-context'
import { submitForm } from '@/lib/formspree'
import { trackPixelEvent } from '@/lib/meta-pixel'

const WHATSAPP_NUMBER = '212644261566'

export function LotPageClient({ lot }: { lot: Lot }) {
  // Personnalisation (dormant tant qu'aucun produit n'a customizable: true)
  const [variant, setVariant] = useState<'standard' | 'personnalise'>('standard')

  // Détail / Grossiste — nouveau principe de commande pour les 12 produits
  const [mode, setMode] = useState<'detail' | 'gros'>('detail')
  const modeMin = mode === 'gros' ? lot.wholesaleMinQty : lot.minOrder
  const modeMax = mode === 'detail' ? lot.retailMaxQty : Infinity
  const modeStep = mode === 'gros' ? lot.wholesaleStep : lot.minOrder

  const [qty, setQty] = useState(lot.minOrder)
  const [added, setAdded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  const [orderOpen, setOrderOpen] = useState(false)
  const [orderName, setOrderName] = useState('')
  const [orderPhone, setOrderPhone] = useState('')
  const [orderAddress, setOrderAddress] = useState('')
  const [orderCustomDesc, setOrderCustomDesc] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderWhatsappLink, setOrderWhatsappLink] = useState('')

  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_name: lot.title,
      content_ids: [lot.slug],
      content_type: 'product',
      value: lot.pricingTiers[0].pricePerUnit * lot.minOrder,
      currency: 'XOF',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lot.slug])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.lp-fu').forEach((el, i) => {
              setTimeout(() => el.classList.add('lp-in'), i * 70)
            })
          }
        })
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const unitPrice = useMemo(() => {
    const base = getPriceForQty(lot, qty)
    return variant === 'personnalise' ? base + CUSTOMIZATION_SURCHARGE : base
  }, [lot, qty, variant])
  const totalPrice = useMemo(() => Math.round(unitPrice * qty), [unitPrice, qty])
  const basePriceEffective = variant === 'personnalise' ? lot.basePrice + CUSTOMIZATION_SURCHARGE : lot.basePrice
  const savings = useMemo(() => Math.max(0, Math.round((basePriceEffective - unitPrice) * qty)), [basePriceEffective, unitPrice, qty])
  const savingsPercent = useMemo(() => Math.max(0, Math.round(((basePriceEffective - unitPrice) / basePriceEffective) * 100)), [basePriceEffective, unitPrice])

  const otherLots = getOtherLots(lot.slug, 3)
  const step = modeStep

  // Image principale = image du slider (packshot détouré), avec repli sur heroImg
  const mainImg = SLIDER_IMAGES[lot.slug] ?? lot.heroImg

  const clamp = (v: number) => Math.max(modeMin, Math.min(modeMax, v))

  const adjustQty = (delta: number) => setQty((q) => clamp(q + delta))

  const handleModeChange = (m: 'detail' | 'gros') => {
    setMode(m)
    if (m === 'gros') {
      setQty((q) => Math.max(lot.wholesaleMinQty, q))
    } else {
      setQty((q) => Math.min(lot.retailMaxQty, Math.max(lot.minOrder, q)))
    }
  }

  const handleVariantChange = (v: 'standard' | 'personnalise') => {
    setVariant(v)
    const newMin = lot.customizable && v === 'personnalise' ? CUSTOMIZATION_MIN_ORDER : lot.minOrder
    setQty((q) => Math.max(newMin, q))
  }

  const handleAddToCart = () => {
    const isPerso = lot.customizable && variant === 'personnalise'
    addItem({
      id: isPerso ? `${lot.slug}-personnalise` : lot.slug,
      name: isPerso ? `${lot.shortTitle} (personnalisé)` : lot.shortTitle,
      price: unitPrice,
      quantity: qty,
      image: mainImg,
      unit: lot.unit,
    })
    trackPixelEvent('AddToCart', {
      content_name: lot.title,
      content_ids: [lot.slug],
      content_type: 'product',
      value: totalPrice,
      currency: 'XOF',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const fmt = (n: number) => n.toLocaleString('fr-FR')

  const closeOrderModal = () => {
    if (orderSubmitting) return
    setOrderOpen(false)
    setOrderSuccess(false)
    setOrderError('')
    setOrderCustomDesc('')
  }

  const isPersonalized = lot.customizable && variant === 'personnalise'

  const handleOrderSubmit = async () => {
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) {
      setOrderError('Merci de renseigner votre nom, votre téléphone et votre adresse')
      return
    }
    if (isPersonalized && !orderCustomDesc.trim()) {
      setOrderError('Merci de décrire ce que vous souhaitez pour votre personnalisation')
      return
    }
    setOrderError('')
    setOrderSubmitting(true)
    const res = await submitForm({
      _subject: `Nouvelle commande MedLoty — ${lot.title}`,
      nom: orderName,
      telephone: orderPhone,
      adresse: orderAddress,
      lot: lot.title,
      typeCommande: mode === 'gros' ? 'Grossiste' : 'Détail',
      version: lot.customizable ? (variant === 'personnalise' ? 'Personnalisé (logo)' : 'Standard') : 'Standard',
      personnalisation: isPersonalized ? orderCustomDesc : 'Non applicable',
      quantite: `${fmt(qty)} ${lot.unit}`,
      prixUnitaire: `${fmt(unitPrice)} FCFA`,
      total: `${fmt(totalPrice)} FCFA`,
    })
    setOrderSubmitting(false)

    if (res.ok) {
      trackPixelEvent('Purchase', {
        content_name: lot.title,
        content_ids: [lot.slug],
        content_type: 'product',
        value: totalPrice,
        currency: 'XOF',
      })
      setOrderSuccess(true)

      if (isPersonalized) {
        const message = `Bonjour, je viens de commander ${lot.title} personnalisé (${fmt(qty)} ${lot.unit}) sur medloty.com au nom de ${orderName}. Voici ma demande de personnalisation : ${orderCustomDesc}. Je vous envoie mon logo :`
        setOrderWhatsappLink(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`)
      } else {
        setTimeout(() => {
          setOrderOpen(false)
          setOrderSuccess(false)
          setOrderName('')
          setOrderPhone('')
          setOrderAddress('')
        }, 3000)
      }
    } else {
      setOrderError(res.error || "Erreur lors de l'envoi, réessayez")
    }
  }

  return (
    <div className="lp-root" style={{ ['--ac' as any]: lot.accent, ['--al' as any]: lot.accentLight, ['--ad' as any]: lot.accentDark }}>
      <SiteHeader />

      <main ref={sectionRef} className="lp">

        {/* Fil d'Ariane */}
        <div className="lp-crumb-bar">
          <nav className="lp-wrap lp-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href="/#lots">Nos produits</Link>
            <span>/</span>
            <span className="lp-breadcrumb-current">{lot.shortTitle}</span>
          </nav>
        </div>

        {/* FICHE PRODUIT — image + achat */}
        <section className="lp-pdp">
          <div className="lp-wrap lp-pdp-grid">

            <div className="lp-pdp-gallery lp-fu">
              <div className="lp-pdp-main-img">
                <img src={mainImg} alt={lot.title} />
              </div>
            </div>

            <div className="lp-pdp-info lp-fu">
              <div className="lp-buybox">
                <span className="lp-pdp-stock">
                  <span className="lp-hero-liq-dot" />
                  En stock · Gros & détail
                </span>
                <h1 className="lp-pdp-title">{lot.title}</h1>
                <p className="lp-pdp-desc">{lot.description}</p>

                <div className="lp-price-compare">
                  <span className="lp-price-old">{fmt(basePriceEffective)} FCFA<small>/{lot.unit === 'pièces' ? 'pièce' : lot.unit}</small></span>
                  <span className="lp-price-arrow">→</span>
                  <span className="lp-price-new">{fmt(unitPrice)} FCFA<small>/{lot.unit === 'pièces' ? 'pièce' : lot.unit}</small></span>
                  {savingsPercent > 0 && <span className="lp-price-badge">-{savingsPercent}%</span>}
                </div>

                {/* Sélecteur Détail / Grossiste */}
                <div className="lp-mode-block">
                  <label className="lp-qty-label">Type de commande</label>
                  <div className="lp-mode-control">
                    <button
                      type="button"
                      className={`lp-mode-btn${mode === 'detail' ? ' lp-mode-btn-active' : ''}`}
                      onClick={() => handleModeChange('detail')}
                    >
                      Détail
                      <span>jusqu'à {fmt(lot.retailMaxQty)} {lot.unit}</span>
                    </button>
                    <button
                      type="button"
                      className={`lp-mode-btn${mode === 'gros' ? ' lp-mode-btn-active' : ''}`}
                      onClick={() => handleModeChange('gros')}
                    >
                      Grossiste
                      <span>dès {fmt(lot.wholesaleMinQty)} {lot.unit} · -{WHOLESALE_DISCOUNT_PERCENT}%</span>
                    </button>
                  </div>
                </div>

                {lot.customizable && (
                  <div className="lp-variant-block">
                    <label className="lp-qty-label">Version</label>
                    <div className="lp-variant-control">
                      <button
                        type="button"
                        className={`lp-variant-btn${variant === 'standard' ? ' lp-variant-btn-active' : ''}`}
                        onClick={() => handleVariantChange('standard')}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        className={`lp-variant-btn${variant === 'personnalise' ? ' lp-variant-btn-active' : ''}`}
                        onClick={() => handleVariantChange('personnalise')}
                      >
                        Personnalisé <span>+{CUSTOMIZATION_SURCHARGE} FCFA/pièce</span>
                      </button>
                    </div>
                    {variant === 'personnalise' && (
                      <span className="lp-qty-min">Personnalisation à partir de {fmt(CUSTOMIZATION_MIN_ORDER)} {lot.unit}</span>
                    )}
                  </div>
                )}

                <div className="lp-qty-block">
                  <label className="lp-qty-label">Quantité ({lot.unit})</label>
                  <div className="lp-qty-control">
                    <button type="button" className="lp-qty-btn" onClick={() => adjustQty(-step)} aria-label="Diminuer">−</button>
                    <input
                      type="number"
                      className="lp-qty-input"
                      value={qty}
                      min={modeMin}
                      onChange={(e) => setQty(clamp(Number(e.target.value) || modeMin))}
                    />
                    <button type="button" className="lp-qty-btn" onClick={() => adjustQty(step)} aria-label="Augmenter">+</button>
                  </div>
                  <span className="lp-qty-min">
                    {mode === 'detail'
                      ? `Détail : de ${fmt(lot.minOrder)} à ${fmt(lot.retailMaxQty)} ${lot.unit}`
                      : `Grossiste : à partir de ${fmt(lot.wholesaleMinQty)} ${lot.unit}, par ${fmt(lot.wholesaleStep)}`}
                  </span>
                </div>

                <div className="lp-price-block">
                  {savings > 0 && (
                    <div className="lp-price-row">
                      <span className="lp-price-label">Économie réalisée</span>
                      <span className="lp-price-val-savings">-{savingsPercent}% · {fmt(savings)} FCFA</span>
                    </div>
                  )}
                  <div className="lp-price-row lp-price-total-row">
                    <span className="lp-price-label-total">Total</span>
                    <span className="lp-price-total">{fmt(totalPrice)} <small>FCFA</small></span>
                  </div>
                </div>

                <div className="lp-cta-row">
                  <button type="button" className={`lp-cta${added ? ' lp-cta-added' : ''}`} onClick={handleAddToCart}>
                    {added ? '✓ Ajouté' : 'Ajouter au panier'}
                  </button>
                  <button type="button" className="lp-order-btn" onClick={() => {
                    trackPixelEvent('InitiateCheckout', {
                      content_name: lot.title,
                      content_ids: [lot.slug],
                      content_type: 'product',
                      value: totalPrice,
                      currency: 'XOF',
                    })
                    setOrderOpen(true)
                  }}>
                    Commander
                  </button>
                </div>

                <div className="lp-delivery">📦 Livraison partout au Sénégal</div>
              </div>
            </div>
          </div>
        </section>

        {/* DÉTAILS PRODUIT */}
        <section className="lp-details">
          <div className="lp-wrap lp-details-grid">

            <div className="lp-fu lp-block">
              <span className="lp-block-eyebrow">✦ Description</span>
              <h2 className="lp-block-title">À propos de ce produit</h2>
              <p className="lp-block-text">{lot.longDescription}</p>
            </div>

            <div className="lp-fu lp-block">
              <span className="lp-block-eyebrow">✦ Avantages</span>
              <h2 className="lp-block-title">Points forts</h2>
              <div className="lp-highlights">
                {lot.highlights.map((h, i) => (
                  <div key={i} className="lp-highlight">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="lp-highlight-icon">
                      <circle cx="9" cy="9" r="9" className="lp-check-bg" />
                      <path d="M5.5 9.5l2.2 2.2L13 6.5" className="lp-check-path" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AUTRES FORMATS SUR DEMANDE (uniquement si le produit en a) */}
        {lot.otherFormats && lot.otherFormats.length > 0 && (
          <section className="lp-formats">
            <div className="lp-wrap">
              <div className="lp-fu lp-formats-card">
                <div className="lp-formats-info">
                  <span className="lp-block-eyebrow">✦ Autres formats</span>
                  <h2 className="lp-block-title">D'autres formats disponibles sur commande</h2>
                  <p className="lp-block-text">
                    En plus de ce format, ces autres formats sont également en stock et disponibles sur commande :
                  </p>
                  <div className="lp-formats-tags">
                    {lot.otherFormats.map((f) => (
                      <span key={f} className="lp-formats-tag">{f}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par d'autres formats de ${lot.title} (${lot.otherFormats.join(', ')}). Pouvez-vous m'en dire plus ?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-formats-btn"
                  onClick={() => trackPixelEvent('Contact', { content_name: `${lot.title} — Autres formats WhatsApp` })}
                >
                  <svg viewBox="0 0 24 24" className="lp-modal-whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Demander sur WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}

        {/* AUTRES PRODUITS */}
        <section className="lp-others">
          <div className="lp-wrap">
            <div className="lp-fu lp-others-head">
              <span className="lp-others-eyebrow">✦ Découvrir aussi</span>
              <h2 className="lp-others-title">D'autres produits disponibles</h2>
            </div>
            <div className="lp-others-grid">
              {otherLots.map((o) => (
                <Link
                  key={o.slug}
                  href={`/lots/${o.slug}`}
                  className="lp-fu lp-other-card"
                  style={{ ['--oac' as any]: o.accent }}
                >
                  <div className="lp-other-img">
                    <img src={SLIDER_IMAGES[o.slug] ?? o.heroImg} alt={o.title} loading="lazy" />
                    <div className="lp-other-overlay" />
                  </div>
                  <div className="lp-other-body">
                    <span className="lp-other-num">{o.num}</span>
                    <span className="lp-other-name">{o.shortTitle}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {orderOpen && (
        <div className="lp-modal-overlay" onClick={closeOrderModal}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            {orderSuccess ? (
              <div className="lp-modal-success">
                <div className="lp-modal-success-icon">🎉</div>
                <h3>Merci {orderName} !</h3>
                {isPersonalized ? (
                  <>
                    <p>
                      Votre commande personnalisée de {fmt(qty)} {lot.unit} — {lot.shortTitle} a bien été reçue.
                      Continuons sur WhatsApp pour finaliser les détails et votre logo.
                    </p>
                    <a
                      href={orderWhatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lp-modal-whatsapp-btn"
                      onClick={() => trackPixelEvent('Contact', { content_name: `${lot.title} — Suivi commande WhatsApp` })}
                    >
                      <svg viewBox="0 0 24 24" className="lp-modal-whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Continuer sur WhatsApp
                    </a>
                  </>
                ) : (
                  <p>
                    Votre commande de {fmt(qty)} {lot.unit} — {lot.shortTitle} a bien été reçue.
                    Nous vous contactons très vite au {orderPhone}.
                  </p>
                )}
              </div>
            ) : (
              <>
                <button type="button" className="lp-modal-close" onClick={closeOrderModal} aria-label="Fermer">×</button>
                <h3 className="lp-modal-title">Commander</h3>
                <p className="lp-modal-sub">
                  {lot.shortTitle}{isPersonalized ? ' (personnalisé)' : ''} · {mode === 'gros' ? 'Grossiste' : 'Détail'} · {fmt(qty)} {lot.unit} · {fmt(totalPrice)} FCFA
                </p>

                <div className="lp-modal-field">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="lp-modal-field">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="Ex : 77 123 45 67"
                  />
                </div>
                <div className="lp-modal-field">
                  <label>Adresse de livraison</label>
                  <input
                    type="text"
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    placeholder="Quartier, ville..."
                  />
                </div>

                {isPersonalized && (
                  <div className="lp-modal-field">
                    <label>Décrivez votre personnalisation</label>
                    <textarea
                      value={orderCustomDesc}
                      onChange={(e) => setOrderCustomDesc(e.target.value)}
                      placeholder="Couleurs, emplacement du logo, quantité envisagée..."
                      rows={3}
                    />
                  </div>
                )}

                {orderError && <div className="lp-modal-error">{orderError}</div>}

                <button
                  type="button"
                  className="lp-modal-submit"
                  disabled={orderSubmitting}
                  onClick={handleOrderSubmit}
                >
                  {orderSubmitting ? 'Envoi...' : 'Envoyer ma commande'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}