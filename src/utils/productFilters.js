const sorters = {
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  popular: (a, b) => b.reviews - a.reviews,
}

export function filterAndSortProducts(products, filters = {}) {
  const {
    query = '',
    brand = '',
    minPrice = 0,
    maxPrice = Number.POSITIVE_INFINITY,
    rating = 0,
    sort = 'popular',
  } = filters

  const normalizedQuery = query.trim().toLowerCase()
  const results = products.filter((product) => {
    const searchText = [product.title, product.category, product.subcategory, product.brand]
      .join(' ')
      .toLowerCase()

    return (
      (!normalizedQuery || searchText.includes(normalizedQuery)) &&
      (!brand || product.brand === brand) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= rating
    )
  })

  return [...results].sort(sorters[sort] || sorters.popular)
}
