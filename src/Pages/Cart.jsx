import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../Components/common/EmptyState'
import QuantitySelector from '../Components/common/QuantitySelector'
import { useShop } from '../Context/ShopContext'
import { formatCurrency } from '../utils/currency'

export default function Cart() {
  const { cartDetails, updateQuantity, removeFromCart, subtotal, shipping, discount, total, coupon, applyCoupon } = useShop()
  const [promo, setPromo] = useState('')

  if (!cartDetails.length) return <div className="page-section container"><EmptyState title="Your cart is empty" message="Add something you like and it will appear here." /></div>

  return (
    <div className="page-section container">
      <div className="page-title-row"><div><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1></div><Link to="/products" className="text-link">Continue shopping →</Link></div>
      <div className="cart-layout">
        <section className="cart-list">
          {cartDetails.map(({ key, product, size, color, quantity }) => (
            <article className="cart-item" key={key}>
              <Link to={`/product/${product.id}`}><img src={product.images[0]} alt={product.title} /></Link>
              <div className="cart-item-main"><div><p className="product-brand">{product.brand}</p><Link className="cart-item-title" to={`/product/${product.id}`}>{product.title}</Link><div className="cart-variants">{size && <span>Size: {size}</span>}{color && <span>Color: {color}</span>}</div></div><button type="button" className="text-button danger" onClick={() => removeFromCart(key)}>Remove</button></div>
              <div className="cart-item-controls"><QuantitySelector value={quantity} onChange={(value) => updateQuantity(key, value)} max={product.stock} /><strong>{formatCurrency(product.price * quantity)}</strong></div>
            </article>
          ))}
        </section>
        <aside className="order-summary-card">
          <h2>Order summary</h2>
          <div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-line"><span>Shipping</span><strong>{shipping ? formatCurrency(shipping) : 'Free'}</strong></div>{discount > 0 && <div className="summary-line discount-line"><span>Discount ({coupon?.code})</span><strong>−{formatCurrency(discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <form className="promo-form" onSubmit={(event) => { event.preventDefault(); applyCoupon(promo) }}><input className="input" value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Promo code" /><button className="btn btn-outline" type="submit">Apply</button></form><small>Try <strong>EASY10</strong> for this portfolio demo.</small>
          <Link className="btn btn-primary full-width" to="/checkout">Proceed to checkout</Link>
        </aside>
      </div>
    </div>
  )
}
