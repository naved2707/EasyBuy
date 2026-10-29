import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../Components/common/Breadcrumbs'
import ProductGrid, { ProductGridSkeleton } from '../Components/common/ProductGrid'
import QuantitySelector from '../Components/common/QuantitySelector'
import Rating from '../Components/common/Rating'
import { useShop } from '../Context/ShopContext'
import { productService } from '../services/productService'
import { formatCurrency } from '../utils/currency'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products, addToCart, wishlist, toggleWishlist } = useShop()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let active = true
    setLoading(true)
    setProduct(null)
    setError('')
    setSize('')
    setColor('')
    setQuantity(1)
    productService.getById(productId).then((data) => {
      if (!active) return
      setProduct(data)
      setSelectedImage(data?.images?.[0] || '')
    }).catch(() => {
      if (active) setError('We could not load this product. Please try again.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    window.scrollTo({ top: 0 })
    return () => { active = false }
  }, [productId])

  const related = useMemo(() => product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4) : [], [product, products])

  if (loading) return <div className="page-section container"><ProductGridSkeleton count={4} /></div>
  if (error) return <div className="page-section container"><div className="not-found-card"><h1>Unable to load product</h1><p>{error}</p><Link className="btn btn-primary" to="/products">Back to shop</Link></div></div>
  if (!product) return <div className="page-section container"><div className="not-found-card"><h1>Product not found</h1><p>The product may have been removed or the link is invalid.</p><Link className="btn btn-primary" to="/products">Back to shop</Link></div></div>

  const saved = wishlist.includes(product.id)
  const categoryRoute = product.category === 'men' ? '/mens' : product.category === 'women' ? '/womens' : '/kids'
  const canBuy = product.stock > 0

  const handleAdd = (buyNow = false) => {
    const added = addToCart(product.id, { size, color, quantity })
    if (added && buyNow) navigate('/checkout')
  }

  return (
    <div className="page-section container">
      <Breadcrumbs items={[{ label: 'Shop', to: '/products' }, { label: product.category, to: categoryRoute }, { label: product.title }]} />
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="thumbnail-list">{product.images.map((image, index) => <button type="button" className={selectedImage === image ? 'active' : ''} key={`${image}-${index}`} onClick={() => setSelectedImage(image)}><img src={image} alt={`${product.title} view ${index + 1}`} /></button>)}</div>
          <div className="main-product-image"><img src={selectedImage} alt={product.title} /></div>
        </div>
        <div className="product-info-panel">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.title}</h1>
          <Rating value={product.rating} reviews={product.reviews} />
          <div className="detail-price"><strong>{formatCurrency(product.price)}</strong><span>{formatCurrency(product.originalPrice)}</span><b>{product.discount}% off</b></div>
          <p className="product-description">{product.description}</p>
          <div className={`stock-pill ${product.stock === 0 ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : ''}`}>{product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left` : 'In stock') : 'Out of stock'}</div>

          {product.sizes.length > 0 && <div className="option-group"><div className="option-heading"><strong>Select size</strong>{!size && <span>Required</span>}</div><div className="option-buttons">{product.sizes.map((item) => <button type="button" key={item} onClick={() => setSize(item)} className={size === item ? 'selected' : ''}>{item}</button>)}</div></div>}
          {product.colors.length > 0 && <div className="option-group"><div className="option-heading"><strong>Select color</strong>{!color && <span>Required</span>}</div><div className="option-buttons">{product.colors.map((item) => <button type="button" key={item} onClick={() => setColor(item)} className={color === item ? 'selected' : ''}>{item}</button>)}</div></div>}

          <div className="detail-purchase-row">{canBuy && <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />}<button className="btn btn-primary flex-btn" type="button" disabled={!canBuy} onClick={() => handleAdd(false)}>Add to cart</button><button className="btn btn-outline icon-btn" type="button" onClick={() => toggleWishlist(product.id)} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>{saved ? '♥' : '♡'}</button></div>
          <button className="btn btn-dark full-width" type="button" disabled={!canBuy} onClick={() => handleAdd(true)}>Buy now</button>

          <div className="product-meta"><div><span>Category</span><strong>{product.category}</strong></div><div><span>Type</span><strong>{product.subcategory}</strong></div><div><span>SKU</span><strong>EB-{product.id}</strong></div></div>
          <div className="delivery-points"><p>✓ Free shipping above ₹999</p><p>✓ Easy 7-day demo return policy</p><p>✓ No real payment gateway is connected</p></div>
        </div>
      </div>

      <section className="product-description-section"><h2>Product details</h2><p>{product.description}</p><div className="detail-facts"><div><span>Brand</span><strong>{product.brand}</strong></div><div><span>Rating</span><strong>{product.rating}/5</strong></div><div><span>Reviews</span><strong>{product.reviews}</strong></div><div><span>Available stock</span><strong>{product.stock}</strong></div></div><div className="review-summary"><div><strong>{product.rating}</strong><span>out of 5</span></div><div><h3>Customer reviews</h3><p>{product.reviews} ratings are represented in this demo product dataset. No fake written testimonials are added.</p></div></div></section>
      {related.length > 0 && <section className="section compact-section"><div className="section-heading"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>Related products</h2></div></div><ProductGrid products={related} /></section>}
    </div>
  )
}
