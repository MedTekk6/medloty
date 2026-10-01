'use client'

import { useCart } from '@/context/cart-context'
import Link from 'next/link'
import { useState } from 'react'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react'
import { submitForm } from '@/lib/formspree'
import { getLotBySlug, getPriceForQty, getTierLabel, SLIDER_IMAGES, CUSTOMIZATION_MIN_ORDER, CUSTOMIZATION_SURCHARGE } from '@/data/lots'
import { trackPixelEvent } from '@/lib/meta-pixel'
import toast from 'react-hot-toast'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Chaque ligne recalcule son prix unitaire en direct depuis la grille
  // tarifaire dégressive du lot (source unique de vérité : data/lots.ts),
  // au lieu de se fier à un prix figé au moment de l'ajout au panier.
  const lines = items.map((item) => {
    const isPersonalized = item.id.endsWith('-personnalise')
    const baseSlug = isPersonalized ? item.id.replace(/-personnalise$/, '') : item.id
    const lot = getLotBySlug(baseSlug)
    const unitPrice = lot
      ? getPriceForQty(lot, item.quantity) + (isPersonalized ? CUSTOMIZATION_SURCHARGE : 0)
      : item.price
    const tierLabel = lot ? getTierLabel(lot, item.quantity) : null
    const thumb = (lot && SLIDER_IMAGES[lot.slug]) || lot?.galleryImgs[1] || lot?.galleryImgs[0] || item.image
    const minOrder = lot ? (isPersonalized ? CUSTOMIZATION_MIN_ORDER : lot.minOrder) : 1
    const step = minOrder
    return { item, lot, unitPrice, tierLabel, thumb, minOrder, step, lineTotal: unitPrice * item.quantity }
  })

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  const adjustQty = (id: string, current: number, delta: number, minOrder: number) => {
    const next = current + delta
    if (next < minOrder) return
    updateQuantity(id, next)
  }

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('Merci de renseigner votre nom, votre téléphone et votre adresse')
      return
    }
    setSubmitting(true)
    const articlesText = lines
      .map((l) => `${l.item.name} — ${l.item.quantity} ${l.item.unit} × ${formatPrice(l.unitPrice)}`)
      .join('\n')

    trackPixelEvent('InitiateCheckout', {
      content_ids: lines.map((l) => l.item.id),
      content_type: 'product',
      num_items: lines.length,
      value: total,
      currency: 'XOF',
    })

    const res = await submitForm({
      _subject: `Nouvelle commande MedLoty`,
      nom: name,
      telephone: phone,
      adresse: address,
      articles: articlesText,
      total: formatPrice(total),
    })
    setSubmitting(false)

    if (res.ok) {
      trackPixelEvent('Purchase', {
        content_ids: lines.map((l) => l.item.id),
        content_type: 'product',
        num_items: lines.length,
        value: total,
        currency: 'XOF',
      })
      setSuccess(true)
      clearCart()
      setTimeout(() => {
        setSuccess(false)
        setName('')
        setPhone('')
        setAddress('')
      }, 3000)
    } else {
      toast.error(res.error || "Échec de l'envoi de la commande")
    }
  }

  if (success) {
    return (
      <div className="cart-state cart-success">
        <div className="cart-state-icon">🎉</div>
        <h2 className="cart-state-title">Merci {name} !</h2>
        <p className="cart-state-text">Votre commande a bien été reçue. Nous vous contactons très vite au {phone}.</p>
        <style>{cartStyles}</style>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-state cart-empty">
        <ShoppingCart size={48} strokeWidth={1.5} className="cart-state-cart-icon" />
        <h2 className="cart-state-title">Votre panier est vide</h2>
        <p className="cart-state-text">Découvrez nos produits et remplissez votre panier</p>
        <Link href="/" className="cart-empty-cta">Voir les produits</Link>
        <style>{cartStyles}</style>
      </div>
    )
  }

  return (
    <div className="cart-grid">
      {/* ===== ARTICLES ===== */}
      <div className="cart-items-col">
        <div className="cart-panel">
          <div className="cart-panel-head">
            <span className="cart-count">{items.length} article{items.length > 1 ? 's' : ''}</span>
            <button onClick={clearCart} className="cart-clear-btn">Vider le panier</button>
          </div>

          <div className="cart-items-list">
            {lines.map(({ item, thumb, unitPrice, tierLabel, minOrder, step, lineTotal }) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-thumb">
                  <img src={thumb} alt={item.name} loading="lazy" />
                </div>

                <div className="cart-item-body">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-unit">
                    {formatPrice(unitPrice)} / {item.unit}
                    {tierLabel && <span className="cart-item-tier"> · Palier {tierLabel}</span>}
                  </p>

                  <div className="cart-item-qty">
                    <button
                      onClick={() => adjustQty(item.id, item.quantity, -step, minOrder)}
                      className="cart-qty-btn"
                      aria-label="Diminuer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="cart-qty-val">{(item.quantity ?? 0).toLocaleString('fr-FR')}</span>
                    <button
                      onClick={() => adjustQty(item.id, item.quantity, step, minOrder)}
                      className="cart-qty-btn"
                      aria-label="Augmenter"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="cart-item-min">Min. {minOrder.toLocaleString('fr-FR')} {item.unit}</span>
                </div>

                <div className="cart-item-side">
                  <span className="cart-item-total">{formatPrice(lineTotal)}</span>
                  <button onClick={() => removeItem(item.id)} className="cart-remove-btn" aria-label="Retirer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="cart-continue">
            <ArrowLeft size={16} />
            Continuer mes achats
          </Link>
        </div>
      </div>

      {/* ===== RÉSUMÉ ===== */}
      <div className="cart-summary-col">
        <div className="cart-panel cart-summary">
          <h3 className="cart-summary-title">Récapitulatif</h3>

          <div className="cart-summary-rows">
            <div className="cart-summary-row cart-summary-total-row">
              <span>Total</span>
              <span className="cart-summary-total-val">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="cart-form">
            <input
              type="text" placeholder="Nom complet"
              value={name} onChange={(e) => setName(e.target.value)}
              className="cart-input"
            />
            <input
              type="tel" placeholder="Téléphone (WhatsApp de préférence)"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              className="cart-input"
            />
            <input
              type="text" placeholder="Adresse de livraison"
              value={address} onChange={(e) => setAddress(e.target.value)}
              className="cart-input"
            />
          </div>

          <button onClick={handleOrder} disabled={submitting} className="cart-order-btn">
            {submitting ? 'Envoi...' : 'Commander'}
          </button>

          <p className="cart-note">🔒 Commande sécurisée · Confirmation par SMS</p>
        </div>
      </div>

      <style>{cartStyles}</style>
    </div>
  )
}

const cartStyles = `
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    align-items: start;
  }

  .cart-panel {
    background: white;
    border-radius: 18px;
    border: 1.5px solid #ECE6DA;
    padding: 22px;
    box-sizing: border-box;
  }

  /* ── ARTICLES ── */
  .cart-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 14px; margin-bottom: 6px;
    border-bottom: 1.5px solid #F4F0E8;
  }
  .cart-count { font-size: 13.5px; font-weight: 700; color: #6B7280; }
  .cart-clear-btn {
    font-size: 12.5px; color: #E53935; background: none; border: none;
    cursor: pointer; font-weight: 600;
  }

  .cart-items-list { display: flex; flex-direction: column; }
  .cart-item {
    display: grid;
    grid-template-columns: 64px 1fr auto;
    gap: 14px; align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1.5px solid #F4F0E8;
  }
  .cart-item:last-child { border-bottom: none; }

  .cart-item-thumb {
    width: 64px; height: 64px; border-radius: 12px; overflow: hidden;
    background: #FAFAF7; border: 1.5px solid #F0EBDF; flex-shrink: 0;
  }
  .cart-item-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .cart-item-body { min-width: 0; }
  .cart-item-name { font-size: 14.5px; font-weight: 700; color: #1A1A1A; margin: 0 0 3px; }
  .cart-item-unit { font-size: 12.5px; color: #8A8A8A; margin: 0 0 8px; }
  .cart-item-tier { color: #C8843A; font-weight: 700; }

  .cart-item-qty { display: flex; align-items: center; gap: 8px; }
  .cart-qty-btn {
    width: 26px; height: 26px; border-radius: 50%;
    border: 1.5px solid #E0DACE; background: white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #4B5563; flex-shrink: 0;
    transition: border-color 0.2s, color 0.2s;
  }
  .cart-qty-btn:hover { border-color: #C8843A; color: #C8843A; }
  .cart-qty-val { min-width: 40px; text-align: center; font-weight: 700; font-size: 13.5px; color: #1A1A1A; }
  .cart-item-min { display: block; font-size: 10.5px; color: #B0A898; margin-top: 5px; }

  .cart-item-side {
    display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
  }
  .cart-item-total { font-weight: 800; font-size: 14.5px; color: #C8843A; white-space: nowrap; }
  .cart-remove-btn { background: none; border: none; color: #B0A898; cursor: pointer; padding: 2px; }
  .cart-remove-btn:hover { color: #E53935; }

  .cart-continue {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13.5px; color: #6B7280; text-decoration: none;
    margin-top: 14px; font-weight: 600;
  }
  .cart-continue:hover { color: #1A1A1A; }

  /* ── RÉSUMÉ ── */
  .cart-summary-title {
    font-size: 17px; font-weight: 800; color: #1A1A1A;
    padding-bottom: 14px; margin: 0 0 14px;
    border-bottom: 1.5px solid #F4F0E8;
  }
  .cart-summary-rows { display: flex; flex-direction: column; gap: 10px; }
  .cart-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13.5px; color: #6B7280;
  }
  .cart-summary-val { font-weight: 700; color: #1A1A1A; }
  .cart-summary-total-row {
    border-top: 1.5px solid #F4F0E8; margin-top: 4px; padding-top: 12px;
    font-size: 15.5px; font-weight: 800; color: #1A1A1A;
  }
  .cart-summary-total-val { font-size: 19px; font-weight: 800; color: #C8843A; }

  .cart-form { display: flex; flex-direction: column; gap: 9px; margin-top: 18px; }
  .cart-input {
    width: 100%; padding: 10px 13px; border-radius: 10px;
    border: 1.5px solid #E0DACE; font-size: 13.5px;
    box-sizing: border-box; font-family: inherit;
    transition: border-color 0.2s;
  }
  .cart-input:focus { outline: none; border-color: #C8843A; }

  .cart-order-btn {
    width: 100%; margin-top: 12px;
    background: #C8843A; color: white;
    padding: 13px; border-radius: 10px; border: none;
    font-weight: 700; font-size: 14.5px; cursor: pointer;
    transition: background 0.2s;
  }
  .cart-order-btn:hover:not(:disabled) { background: #A66A28; }
  .cart-order-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .cart-note { font-size: 11.5px; color: #A8A8A8; text-align: center; margin: 14px 0 0; }

  /* ── ÉTATS (vide / succès) ── */
  .cart-state {
    background: white; border-radius: 20px; border: 1.5px solid #ECE6DA;
    padding: 56px 20px; text-align: center;
    max-width: 460px; margin: 0 auto;
  }
  .cart-state-icon { font-size: 52px; margin-bottom: 14px; }
  .cart-state-cart-icon { color: #D8CFC0; margin-bottom: 14px; }
  .cart-state-title { font-size: 21px; font-weight: 800; color: #1A1A1A; margin: 0 0 8px; }
  .cart-state-text { color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0; }
  .cart-empty-cta {
    display: inline-block; margin-top: 22px;
    background: #C8843A; color: white; padding: 12px 30px;
    border-radius: 10px; font-weight: 700; font-size: 14px;
    text-decoration: none;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .cart-grid { grid-template-columns: 1fr; }
    .cart-summary-col { order: -1; }
  }

  @media (max-width: 560px) {
    .cart-panel { padding: 16px; border-radius: 14px; }
    .cart-item { grid-template-columns: 52px 1fr auto; gap: 10px; padding: 13px 0; }
    .cart-item-thumb { width: 52px; height: 52px; }
    .cart-item-name { font-size: 13.5px; }
    .cart-item-total { font-size: 13.5px; }
    .cart-state { padding: 40px 16px; border-radius: 16px; }
    .cart-state-title { font-size: 18px; }
  }

  @media (max-width: 380px) {
    .cart-item { grid-template-columns: 44px 1fr auto; }
    .cart-item-thumb { width: 44px; height: 44px; }
    .cart-qty-btn { width: 24px; height: 24px; }
  }
`