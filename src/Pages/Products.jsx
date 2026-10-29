import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../Components/common/Breadcrumbs'
import EmptyState from '../Components/common/EmptyState'
import ProductGrid, { ProductGridSkeleton } from '../Components/common/ProductGrid'
import { productService } from '../services/productService'
import { filterAndSortProducts } from '../utils/productFilters'

export default function Products({ category: fixedCategory = '' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [error, setError] = useState('')

  const query = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'popular'
  const category = fixedCategory || searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const minPrice = Number(searchParams.get('min') || 0)
  const maxPrice = Number(searchParams.get('max') || 5000)
  const rating = Number(searchParams.get('rating') || 0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    productService.getAll().then((data) => {
      if (active) setAllProducts(data)
    }).catch(() => {
      if (active) setError('We could not load products. Please try again.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const availableProducts = useMemo(
    () => category ? allProducts.filter((product) => product.category === category) : allProducts,
    [allProducts, category],
  )
  const brands = useMemo(() => [...new Set(availableProducts.map((product) => product.brand))].sort(), [availableProducts])

  const filteredProducts = useMemo(
    () => filterAndSortProducts(availableProducts, { query, brand, minPrice, maxPrice, rating, sort }),
    [availableProducts, query, brand, minPrice, maxPrice, rating, sort],
  )

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (key === 'category') next.delete('brand')
    if (value === '' || value === null || value === undefined) next.delete(key)
    else next.set(key, String(value))
    setSearchParams(next)
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    if (sort && sort !== 'popular') next.set('sort', sort)
    setSearchParams(next)
  }

  const categoryTitles = { men: "Men's Collection", women: "Women's Collection", kids: "Kids' Collection" }
  const title = fixedCategory ? categoryTitles[fixedCategory] : 'Shop All Products'
  const categoryRoute = fixedCategory === 'men' ? '/mens' : fixedCategory === 'women' ? '/womens' : fixedCategory === 'kids' ? '/kids' : '/products'

  return (
    <div className="page-section container">
      <Breadcrumbs items={[{ label: fixedCategory || 'Shop' }]} />
      <div className="listing-header">
        <div><span className="eyebrow">EASYBUY COLLECTION</span><h1>{title}</h1><p>{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} found{query ? ` for “${query}”` : ''}.</p></div>
        <div className="listing-actions">
          <button className="btn btn-outline filter-toggle" type="button" onClick={() => setMobileFiltersOpen((open) => !open)}>Filters</button>
          <label className="sort-control">Sort by
            <select value={sort} onChange={(event) => setFilter('sort', event.target.value)}>
              <option value="popular">Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Rating</option><option value="newest">Newest</option>
            </select>
          </label>
        </div>
      </div>

      <div className="listing-layout">
        <aside className={`filters-panel ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="filter-panel-head"><h2>Filters</h2><button type="button" className="text-button" onClick={clearFilters}>Clear all</button></div>
          <div className="filter-group">
            <label htmlFor="listing-search">Search</label>
            <input id="listing-search" className="input" value={query} onChange={(event) => setFilter('q', event.target.value)} placeholder="Product, brand, category" />
          </div>
          {!fixedCategory && <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select id="category-filter" className="input" value={category} onChange={(event) => setFilter('category', event.target.value)}><option value="">All categories</option><option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option></select>
          </div>}
          <div className="filter-group">
            <label htmlFor="brand-filter">Brand</label>
            <select id="brand-filter" className="input" value={brand} onChange={(event) => setFilter('brand', event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Price range</span>
            <div className="price-inputs"><input className="input" type="number" min="0" value={minPrice} onChange={(event) => setFilter('min', event.target.value)} aria-label="Minimum price" /><span>to</span><input className="input" type="number" min="0" value={maxPrice} onChange={(event) => setFilter('max', event.target.value)} aria-label="Maximum price" /></div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Minimum rating</span>
            <div className="rating-filter-list">
              {[4.5, 4, 3, 0].map((value) => <label key={value}><input type="radio" name="rating" checked={rating === value} onChange={() => setFilter('rating', value || '')} /> {value ? `${value}+ stars` : 'All ratings'}</label>)}
            </div>
          </div>
        </aside>

        <section aria-live="polite">
          {loading ? <ProductGridSkeleton /> : error ? <div className="form-alert error">{error}</div> : filteredProducts.length ? <ProductGrid products={filteredProducts} /> : <EmptyState title="No products match these filters" message="Try removing a filter, changing the price range, or searching for another product." actionLabel="Clear filters" actionTo={categoryRoute} />}
        </section>
      </div>
    </div>
  )
}
