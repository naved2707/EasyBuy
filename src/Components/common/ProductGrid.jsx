import ProductCard from './ProductCard'

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="product-card-body">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
