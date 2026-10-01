'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  unit: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  getItemCount: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('medloty-cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // On ne garde que les articles dont la structure est encore valide —
        // protège contre d'anciennes données de panier (produits/format
        // changés depuis) qui feraient planter l'affichage.
        const valid = Array.isArray(parsed)
          ? parsed.filter(
              (i): i is CartItem =>
                i &&
                typeof i.id === 'string' &&
                typeof i.name === 'string' &&
                typeof i.price === 'number' &&
                typeof i.quantity === 'number' &&
                typeof i.image === 'string' &&
                typeof i.unit === 'string'
            )
          : []
        setItems(valid)
      } catch {
        setItems([])
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('medloty-cart', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = (item: CartItem) => {
    const existing = items.find((i) => i.id === item.id)

    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id)
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })

    if (existing) {
      toast.success(`Quantité augmentée pour ${item.name}`)
    } else {
      toast.success(`${item.name} ajouté au panier`)
    }
  }

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.filter((item) => item.id !== id))
    if (item) {
      toast.success(`${item.name} retiré du panier`)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Panier vidé')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getItemCount = (id: string) => {
    const item = items.find((i) => i.id === id)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}