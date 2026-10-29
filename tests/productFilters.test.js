import test from 'node:test'
import assert from 'node:assert/strict'
import { filterAndSortProducts } from '../src/utils/productFilters.js'

const products = [
  { title: 'Cotton Shirt', category: 'men', subcategory: 'Shirts', brand: 'Alpha', price: 900, rating: 4.2, reviews: 90, createdAt: '2026-08-01' },
  { title: 'Silk Dress', category: 'women', subcategory: 'Dresses', brand: 'Beta', price: 1500, rating: 4.8, reviews: 250, createdAt: '2026-09-20' },
  { title: 'Kids Shirt', category: 'kids', subcategory: 'Shirts', brand: 'Alpha', price: 600, rating: 4.5, reviews: 120, createdAt: '2026-09-01' },
]

test('search is case-insensitive across title/category/subcategory/brand', () => {
  assert.equal(filterAndSortProducts(products, { query: 'SHIRT' }).length, 2)
  assert.equal(filterAndSortProducts(products, { query: 'beta' })[0].title, 'Silk Dress')
})

test('brand, price and rating filters combine correctly', () => {
  const result = filterAndSortProducts(products, { brand: 'Alpha', minPrice: 500, maxPrice: 800, rating: 4.4 })
  assert.deepEqual(result.map((product) => product.title), ['Kids Shirt'])
})

test('supported sorting modes return expected order', () => {
  assert.deepEqual(filterAndSortProducts(products, { sort: 'price-low' }).map((p) => p.price), [600, 900, 1500])
  assert.deepEqual(filterAndSortProducts(products, { sort: 'price-high' }).map((p) => p.price), [1500, 900, 600])
  assert.equal(filterAndSortProducts(products, { sort: 'rating' })[0].rating, 4.8)
  assert.equal(filterAndSortProducts(products, { sort: 'newest' })[0].title, 'Silk Dress')
  assert.equal(filterAndSortProducts(products, { sort: 'popular' })[0].reviews, 250)
})
