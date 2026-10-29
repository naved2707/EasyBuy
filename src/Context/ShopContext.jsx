import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import products from '../data/products'
import { readStorage, writeStorage } from '../utils/storage'
import { useToast } from './ToastContext'

const ShopContext = createContext(null)
const CART_KEY = 'easybuy_cart_v2'
const WISHLIST_KEY = 'easybuy_wishlist_v1'

const buildCartKey = (productId, size, color) => `${productId}-${size || 'na'}-${color || 'na'}`

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []))
  const [coupon, setCoupon] = useState(null)
  const { notify } = useToast()

  useEffect(() => writeStorage(CART_KEY, cart), [cart])
  useEffect(() => writeStorage(WISHLIST_KEY, wishlist), [wishlist])

  const addToCart = (productId, options = {}) => {
    const product = products.find((item) => item.id === Number(productId))
    if (!product || product.stock <= 0) {
      notify('This product is currently out of stock.', 'error')
      return false
    }

    const size = options.size || ''
    const color = options.color || ''
    if (product.sizes.length > 0 && !size) {
      notify('Please select a size first.', 'error')
      return false
    }
    if (product.colors.length > 0 && !color) {
      notify('Please select a color first.', 'error')
      return false
    }

    const requestedQuantity = Math.max(1, Number(options.quantity) || 1)
    const key = buildCartKey(product.id, size, color)
    const existing = cart.find((item) => item.key === key)

    if (existing?.quantity >= product.stock) {
      notify(`Only ${product.stock} items are available for this option.`, 'error')
      return false
    }

    const availableToAdd = product.stock - (existing?.quantity || 0)
    const quantityToAdd = Math.min(requestedQuantity, availableToAdd)
    if (quantityToAdd < requestedQuantity) notify(`Quantity adjusted to available stock (${product.stock}).`, 'info')

    setCart((current) => {
      const currentItem = current.find((item) => item.key === key)
      if (currentItem) {
        return current.map((item) => (item.key === key ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, product.stock) } : item))
      }
      return [...current, { key, productId: product.id, size, color, quantity: quantityToAdd }]
    })
    notify(`${product.title} added to cart.`)
    return true
  }

  const updateQuantity = (key, quantity) => {
    const cartItem = cart.find((item) => item.key === key)
    const product = products.find((productItem) => productItem.id === cartItem?.productId)
    const maxStock = product?.stock || 1
    const requested = Number(quantity) || 1
    const nextQuantity = Math.min(Math.max(requested, 1), maxStock)
    if (requested > maxStock) notify(`Only ${maxStock} items are in stock.`, 'error')
    setCart((current) => current.map((item) => (item.key === key ? { ...item, quantity: nextQuantity } : item)))
  }

  const removeFromCart = (key) => {
    setCart((current) => current.filter((item) => item.key !== key))
    notify('Item removed from cart.', 'info')
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (productId) => {
    const id = Number(productId)
    setWishlist((current) => {
      const exists = current.includes(id)
      notify(exists ? 'Removed from wishlist.' : 'Saved to wishlist.', 'info')
      return exists ? current.filter((itemId) => itemId !== id) : [...current, id]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((id) => id !== Number(productId)))
  }

  const cartDetails = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
        .filter((item) => item.product),
    [cart],
  )

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const subtotal = useMemo(
    () => cartDetails.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartDetails],
  )
  const discount = coupon?.code === 'EASY10' ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99
  const total = Math.max(0, subtotal + shipping - discount)

  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'EASY10') {
      setCoupon({ code: 'EASY10', label: '10% off' })
      notify('Coupon EASY10 applied.')
      return true
    }
    setCoupon(null)
    notify('That promo code is not valid.', 'error')
    return false
  }

  const value = {
    products,
    cart,
    cartDetails,
    cartCount,
    wishlist,
    wishlistCount: wishlist.length,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
    applyCoupon,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
