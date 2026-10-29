import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../Components/common/EmptyState'
import { useShop } from '../Context/ShopContext'
import { formatCurrency } from '../utils/currency'

function WishlistRow({ product }) {
  const { addToCart, removeFromWishlist } = useShop()
  const [size, setSize] = useState(product.sizes[0] || '')
  const [color, setColor] = useState(product.colors[0] || '')

  const moveToCart = () => {
    if (addToCart(product.id, { size, color, quantity: 1 })) removeFromWishlist(product.id)
  }

  return (
    <article className="wishlist-row">
      <Link to={`/product/${product.id}`}><img src={product.images[0]} alt={product.title} /></Link>
      <div className="wishlist-info"><p className="product-brand">{product.brand}</p><Link to={`/product/${product.id}`}>{product.title}</Link><strong>{formatCurrency(product.price)}</strong></div>
      <div className="wishlist-options">{product.sizes.length > 1 && <select className="input" value={size} onChange={(event) => setSize(event.target.value)} aria-label={`Size for ${product.title}`}>{product.sizes.map((item) => <option key={item}>{item}</option>)}</select>}{product.colors.length > 1 && <select className="input" value={color} onChange={(event) => setColor(event.target.value)} aria-label={`Color for ${product.title}`}>{product.colors.map((item) => <option key={item}>{item}</option>)}</select>}</div>
      <div className="wishlist-actions"><button className="btn btn-primary" type="button" onClick={moveToCart}>Move to cart</button><button className="text-button danger" type="button" onClick={() => removeFromWishlist(product.id)}>Remove</button></div>
    </article>
  )
}

export default function Wishlist() {
  const { products, wishlist } = useShop()
  const saved = wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean)
  if (!saved.length) return <div className="page-section container"><EmptyState title="Your wishlist is empty" message="Save products with the heart icon and compare them later." /></div>

  return <div className="page-section container"><div className="page-title-row"><div><span className="eyebrow">SAVED FOR LATER</span><h1>Wishlist</h1><p>{saved.length} item{saved.length === 1 ? '' : 's'} saved.</p></div></div><div className="wishlist-list">{saved.map((product) => <WishlistRow product={product} key={product.id} />)}</div></div>
}
