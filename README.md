# EasyBuy — Professional React E-Commerce Portfolio Project

EasyBuy is an upgraded React + Vite e-commerce application designed to demonstrate practical front-end architecture, real shopping flows, responsive UI, state management, performance basics, and a lightweight Node.js + MongoDB backend.

## Tech stack

**Frontend:** React 19, Vite, JavaScript ES6+, React Router, Context API, CSS, LocalStorage, service layer.

**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcrypt. The backend is intentionally focused on authentication and authenticated orders rather than moving all front-end demo data to the server.

## Main features

- Responsive home page, navigation, mobile menu and search
- Product model with pricing, discounts, brand/category metadata, ratings, reviews, stock, sizes, colors and merchandising flags
- Shop listing with search, category/brand/price/rating filters, results count, sorting, clear filters and empty states
- Debounced navbar search suggestions
- Product details with gallery support, stock state, required size/color selection, quantity validation, wishlist, related products and Buy Now
- Variant-aware cart with add/remove/update, stock limits, persisted LocalStorage, shipping, coupon discount and totals
- Wishlist with LocalStorage and move-to-cart option selection
- Login/register/logout with Auth Context
- Node/MongoDB JWT auth when API is available, with an explicit local demo fallback for frontend-only portfolio deployments
- Multi-step checkout: address, delivery, demo payment choice, review, confirmation
- COD/Card/UPI demonstration UI only — **no payment gateway integration**
- Order success, authenticated order history, order detail and status timeline
- User account with profile summary, wishlist/order links and locally saved address
- Toasts, skeletons, empty/error states, breadcrumbs, 404 page and back-to-top
- Route-level code splitting with `React.lazy` and `Suspense`
- Semantic HTML, keyboard-friendly controls, alt text and responsive layouts

## Frontend setup

Use Node.js `20.19+` (or `22.12+`) because this project uses Vite 8.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Run the dependency-free product filtering/sorting tests with:

```bash
npm test
```

Optional frontend environment variable:

```bash
cp .env.example .env
```

`VITE_API_URL` defaults to `http://localhost:5000/api`.

## Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Update `server/.env` with your MongoDB connection and a strong `JWT_SECRET`, then run:

```bash
npm run dev
```

The API exposes:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:orderId`

## Demo authentication note

The frontend first tries the real API. If the API cannot be reached, registration/login falls back to a browser-only demo mode so a static Vercel deployment is still explorable. This fallback stores demo credentials/session data in LocalStorage and is **not secure or appropriate for production**. In a production system, authentication should rely on the backend and preferably secure HTTP-only cookies or another hardened token strategy.

## Demo coupon

Use `EASY10` in the cart for 10% off.

## Suggested deployment

- Deploy the React frontend to Vercel.
- Deploy the `server` folder to a Node-compatible host such as Render/Railway and connect MongoDB Atlas.
- Set `VITE_API_URL` in Vercel to the deployed backend URL ending in `/api`.
- Set `CLIENT_URL` in the backend to the Vercel frontend URL.

The existing `vercel.json` keeps React Router deep links working on Vercel.
