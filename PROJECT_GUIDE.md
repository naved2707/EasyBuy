# EasyBuy Upgrade Guide — What Changed and What You Should Learn

This file explains the upgraded project in simple English so you can study it before interviews.

## 1. What was already good in the original project

Your original project already had a useful React base:

- React + Vite setup
- React Router navigation
- Context API with a `ShopContext`
- Reusable product card idea
- Men / Women / Kids category routes
- Basic cart count and cart UI
- Separate component CSS files
- A deployed Vercel demo

That means the project did **not** need to be thrown away. The upgrade keeps React, Vite, JavaScript, Router, Context API and your existing product images.

## 2. Main problems found in the original code

The biggest problems were:

- Product data only had name/category/image/current price/old price.
- Cart was an object keyed only by product ID, so size/color variants could not be represented.
- Cart was lost after refresh.
- `removeFromCart` could reduce quantity below zero.
- Product detail size buttons did not store a selected size.
- A product could be added without choosing required options.
- Invalid product IDs could make the product page crash because components expected `product` to exist.
- Category “Sort by” UI had no sorting logic.
- Login page was only static markup.
- Most CSS used fixed widths/margins and was not reliably responsive.
- Product descriptions/category/tags used hard-coded placeholder content.
- There was no wishlist, checkout, order system, account page, error state or 404 page.
- All product data lived directly in UI-oriented files, making a future API migration harder.

## 3. New architecture

Important folders now are:

```text
src/
  components/
    common/
    layout/
  context/
    AuthContext.jsx
    ShopContext.jsx
    ToastContext.jsx
  data/
    products.js
  hooks/
    useDebounce.js
  pages/
  routes/
    AppRoutes.jsx
  services/
    authService.js
    orderService.js
    productService.js
  styles/
    global.css
  utils/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
```

### Why this structure?

- **pages**: route-level screens.
- **components**: reusable UI pieces.
- **context**: global client state.
- **services**: data/API access. Components do not need to know whether data comes from static data or an API.
- **hooks**: reusable React behavior.
- **utils**: small pure helper functions.
- **routes**: route configuration is separate from the root app.
- **server**: backend concerns are completely separated from React.

## 4. Product system

**File:** `src/data/products.js`

Each product now contains the fields needed by the UI:

- `id`
- `title`
- `description`
- `price`
- `originalPrice`
- `discount`
- `category`
- `subcategory`
- `brand`
- `rating`
- `reviews`
- `stock`
- `sizes`
- `colors`
- `images`
- `featured`
- `newArrival`
- `bestSeller`
- `createdAt` (needed for Newest sorting)

`discount` is calculated when the product is created instead of manually repeating the percentage.

### Interview question

**Q: Why keep product data separate from components?**
A: It separates data from presentation, improves reuse/testing, and makes it easier to replace local data with an API later.

## 5. Product listing, filters and sorting

**File:** `src/pages/Products.jsx`

The same page component is reused for:

- `/products`
- `/mens`
- `/womens`
- `/kids`

It supports:

- search
- category filter
- brand filter
- min/max price
- minimum rating
- price low-to-high
- price high-to-low
- rating
- newest
- popular
- clear filters
- results count
- no-results state

Filters are stored in URL query parameters. Example:

```text
/products?category=men&brand=HRX&rating=4&sort=price-low
```

### Why URL search params?

A filtered page can be refreshed, bookmarked or shared without losing the filter state.

### Interview question

**Q: When would you use `useMemo` here?**
A: For derived filtered/sorted results because the calculation depends on product/filter values. It is not used for every small value.

## 6. Search and debouncing

**Files:**

- `src/components/layout/Navbar.jsx`
- `src/hooks/useDebounce.js`
- `src/services/productService.js`

Search is case-insensitive and matches product title, category, subcategory and brand.

### What is debouncing?

Without debouncing, a search request can run after every key press.

If you type:

```text
shirt
```

without debouncing, code may search for `s`, `sh`, `shi`, `shir`, `shirt` immediately.

With the 250ms debounce used here, React waits until typing pauses briefly before requesting suggestions. This reduces unnecessary work and becomes even more important when search uses a real API.

### Interview question

**Q: Debounce vs throttle?**
A: Debounce waits until events stop for a period. Throttle limits how often an action can run during continuous events.

## 7. Product details

**File:** `src/pages/ProductDetail.jsx`

Implemented:

- gallery structure
- title/brand
- rating and reviews count
- current/original price
- discount
- description
- size selection
- color selection
- quantity selector
- stock state
- Add to Cart
- Buy Now
- wishlist
- related products
- invalid product handling

A product cannot be added until required size/color options are selected.

One product intentionally has zero stock so you can demonstrate the out-of-stock handling in an interview.

## 8. Cart architecture

**File:** `src/context/ShopContext.jsx`

The old cart was approximately:

```js
{ 1: 2, 2: 1 }
```

That cannot distinguish:

- Product 1 / Size M / Black
- Product 1 / Size L / Black

The new cart stores variant-aware items:

```js
{
  key: '1-M-Black',
  productId: 1,
  size: 'M',
  color: 'Black',
  quantity: 2
}
```

Cart data is persisted to LocalStorage.

Derived values such as subtotal and grand total are **calculated**, not unnecessarily stored as separate state.

### Cart rules

- quantity never goes below 1
- quantity cannot exceed product stock
- shipping is free for orders ₹999+
- demo coupon `EASY10` gives 10% off
- cart has empty state

### Interview question

**Q: Why should subtotal usually be derived instead of stored in state?**
A: Storing duplicated derived data can become inconsistent. If cart items are the source of truth, subtotal should be calculated from them.

## 9. Wishlist

**Files:**

- `src/context/ShopContext.jsx`
- `src/pages/Wishlist.jsx`

Wishlist IDs are saved in LocalStorage. The wishlist page lets the user select the product options and then move the product into the cart.

## 10. Authentication

**Frontend files:**

- `src/context/AuthContext.jsx`
- `src/services/authService.js`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`

**Backend files:**

- `server/models/User.js`
- `server/controllers/authController.js`
- `server/routes/authRoutes.js`
- `server/middleware/auth.js`

The real backend flow uses:

- MongoDB user record
- bcrypt password hashing
- JWT token
- protected `/api/auth/me`

### Important security note

The frontend also has an explicit **demo fallback** when the API is unreachable. It uses LocalStorage so a frontend-only deployment remains testable.

LocalStorage demo authentication is **not production security**. The real backend is the intended path. In a production app, secure HTTP-only cookies are often preferable for auth tokens because JavaScript cannot directly read them.

### Interview question

**Q: Why should plain passwords never be stored in MongoDB?**
A: Passwords should be hashed with a slow password hashing algorithm such as bcrypt so the original password is not stored.

## 11. Checkout

**File:** `src/pages/Checkout.jsx`

Steps:

1. Shipping Address
2. Delivery Method
3. Payment Method
4. Order Review
5. Confirmation route after order creation

Validation includes:

- full name
- 10-digit phone number
- complete address
- city/state
- 6-digit PIN code

Payment choices are UI demonstrations only:

- Cash on Delivery
- Card UI preview
- UPI UI preview

No card data is collected or sent and no payment gateway is connected.

## 12. Orders

**Frontend:**

- `src/pages/OrderSuccess.jsx`
- `src/pages/Orders.jsx`
- `src/pages/OrderDetail.jsx`
- `src/services/orderService.js`

**Backend:**

- `server/models/Order.js`
- `server/controllers/orderController.js`
- `server/routes/orderRoutes.js`

Statuses supported:

- Processing
- Confirmed
- Shipped
- Out for Delivery
- Delivered
- Cancelled

The backend is used for authenticated orders. Local demo orders are used only when the backend is unavailable or checkout is performed without real API auth.

### Production note

A real commerce backend must calculate and validate prices from trusted database product records. This portfolio backend intentionally stays lightweight, so it accepts the front-end order totals. Mention this trade-off in interviews instead of pretending it is production payment infrastructure.

## 13. User account

**File:** `src/pages/Account.jsx`

Includes:

- profile information
- order link
- wishlist count
- cart link
- multiple saved demo addresses
- logout

Saved address data is local because the backend is intentionally focused on auth and orders.

## 14. UI/UX and responsive work

**File:** `src/styles/global.css`

The old fixed desktop layout was replaced with responsive layouts using CSS Grid/Flexbox and breakpoints.

Implemented UI features include:

- sticky responsive navbar
- mobile navigation
- desktop and mobile search
- modern hero
- categories
- featured/new/best-seller sections
- product cards
- skeleton loading
- toasts
- breadcrumbs
- empty states
- error states
- responsive cart/wishlist/checkout/order pages
- back-to-top button
- footer

Unused old assets were removed and the very large category banners were converted to optimized WebP images. This reduced `src/assets` from about **59 MB to about 3.2 MB**.

## 15. Performance

Implemented only where useful:

- route-level `React.lazy`
- `Suspense`
- image `loading="lazy"` on product cards
- `useMemo` for expensive/derived filtering and cart calculations
- `useCallback` only for the stable toast functions
- optimized WebP category images

There is no unnecessary `useMemo`/`useCallback` everywhere.

## 16. Context API vs Redux Toolkit

For this version, Context API is enough because global state is still limited to:

- cart/wishlist
- auth
- toast notifications

Redux Toolkit becomes more valuable when the app has many independent global features, complex async server state, advanced caching, many cross-page mutations, or when state debugging becomes difficult.

Do **not** migrate just because Redux is popular. You should be able to explain the problem it solves first.

For server data in a larger real app, also consider a server-state library such as TanStack Query rather than putting every API response in Redux.

## 17. Service layer

**Files:** `src/services/`

UI components call services instead of directly knowing the data source.

Today:

- product service reads local product data
- auth service calls Node API and has a demo fallback
- order service calls Node API and has local fallback

Later you can replace `productService` with a REST API without rewriting product card/list UI.

## 18. Error handling

Handled cases include:

- loading products
- failed product loading structure
- no matching products
- invalid product ID
- invalid route (404)
- form validation errors
- login/register API errors
- out-of-stock products
- cart stock limit
- missing orders

## 19. Small automated test coverage

**Files:** `tests/productFilters.test.js` and `src/utils/productFilters.js`

The filter/sort business logic is extracted from the React page so it can be tested without rendering React. `npm test` uses Node's built-in test runner and checks case-insensitive search, combined filters and all sorting modes.

This is intentionally small coverage, but it demonstrates the important idea: business logic is easier to test when it is separated from UI markup.

## 20. SEO and deployment

Added:

- page title
- meta description
- theme color
- Open Graph metadata
- canonical URL
- `public/robots.txt`
- `public/sitemap.xml`
- Vercel SPA rewrite to `index.html`

The sitemap uses the live URL currently provided for EasyBuy. Change it if you later move the project to a custom domain.

## 21. How to run and test

### Frontend

```bash
npm install
npm run dev
```

Test these flows:

1. Open Home on desktop and mobile width.
2. Search `shirt` from navbar.
3. Open Shop and apply category + brand + rating + price filters.
4. Change sorting.
5. Open a product and try Add to Cart **without size/color** — it should block you.
6. Select options and add it.
7. Refresh — cart should still exist.
8. Increase quantity until stock limit.
9. Apply `EASY10`.
10. Add/remove wishlist products and refresh.
11. Register/login.
12. Complete checkout with COD/Card/UPI demo choice.
13. Open order success and order details.
14. Open Account and add/remove saved addresses.
15. Visit `/this-page-does-not-exist` to test 404.
16. Visit `/product/999999` to test Product Not Found.
17. Open product ID `25` to test Out of Stock.

### Backend

Create `server/.env` from the example and set MongoDB/JWT values.

```bash
cd server
npm install
npm run dev
```

Then check:

```text
GET http://localhost:5000/api/health
```

Register from the React UI and confirm the user appears in MongoDB.

## 22. Common mistakes to avoid when explaining this project

- Do not say LocalStorage authentication is secure.
- Do not say Card/UPI payment is integrated. It is UI only.
- Do not say MongoDB stores product data in this version. Product data is still local and behind a service layer.
- Do not say Redux is used. Context API is used intentionally.
- Do not say order totals are production-secure. A real backend must recalculate prices from trusted product records.
- Do not memorize code line by line. Understand the data flow.

## 23. Important interview questions to prepare

1. Why did you use Context API instead of Redux Toolkit?
2. Why do cart items need a composite key for product + size + color?
3. What is the difference between client state and server state?
4. What is debouncing and where did you use it?
5. Why are totals derived instead of stored in state?
6. How does React Router handle `/product/:productId`?
7. What problem does the service layer solve?
8. Why is LocalStorage authentication insecure?
9. How does JWT authentication work in this project?
10. How are passwords stored safely in MongoDB?
11. What does `React.lazy` do?
12. Why should `useMemo` not be used everywhere?
13. How do you prevent a cart quantity from exceeding stock?
14. How is the app responsive?
15. What would you change before using this as a real production store?

## 24. Best next upgrades after this version

Do these only after you understand the current version:

- move products/categories to the backend
- add admin product/order management
- calculate all order prices on the server
- add refresh-token/HTTP-only-cookie authentication
- add image upload/cloud storage
- add real product reviews
- add pagination/infinite scroll for a large catalog
- add TanStack Query for server state
- add automated unit/integration tests
- add a real payment provider only when needed

This version is intentionally kept understandable for a front-end interview while still showing a much more realistic architecture than the original beginner project.
