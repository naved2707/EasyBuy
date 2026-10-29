import products from '../data/products'

// This async service keeps UI code independent from the current data source.
// Later these methods can call a REST API without changing the product pages.
export const productService = {
  async getAll() {
    return products
  },
  async getById(id) {
    return products.find((product) => product.id === Number(id)) || null
  },
  async search(term, limit = 6) {
    const query = term.trim().toLowerCase()
    if (!query) return []

    return products
      .filter((product) =>
        [product.title, product.brand, product.category, product.subcategory]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
      .slice(0, limit)
  },
}
