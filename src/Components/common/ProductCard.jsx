import { Link } from 'react-router-dom'
import { useShop } from '../../Context/ShopContext'
import { formatCurrency } from '../../utils/currency'
import Rating from './Rating'

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useShop()
  const saved = wishlist.includes(product.id)

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
          <img src={product.images[0]} alt={product.title} loading="lazy" />
        </Link>
        <button
          type="button"
          className={`wishlist-button ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={saved}
        >
          {saved ? '♥' : '♡'}
        </button>
        <div className="product-badges">
          {product.stock <= 0 ? <span className="badge badge-stockout">Out of stock</span> : product.newArrival && <span className="badge badge-dark">New</span>}
          {product.stock > 0 && product.discount >= 25 && <span className="badge badge-sale">-{product.discount}%</span>}
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <Link className="product-title" to={`/product/${product.id}`}>{product.title}</Link>
        <Rating value={product.rating} reviews={product.reviews} compact />
        <div className="product-price-row">
          <strong>{formatCurrency(product.price)}</strong>
          <span>{formatCurrency(product.originalPrice)}</span>
        </div>
      </div>
    </article>
  )
}
