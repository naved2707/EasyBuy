import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../Components/layout/Layout'
import ProtectedRoute from '../Components/common/ProtectedRoute'

const Home = lazy(() => import('../Pages/Home'))
const Products = lazy(() => import('../Pages/Products'))
const ProductDetail = lazy(() => import('../Pages/ProductDetail'))
const Cart = lazy(() => import('../Pages/Cart'))
const Wishlist = lazy(() => import('../Pages/Wishlist'))
const Login = lazy(() => import('../Pages/Login'))
const Register = lazy(() => import('../Pages/Register'))
const Checkout = lazy(() => import('../Pages/Checkout'))
const OrderSuccess = lazy(() => import('../Pages/OrderSuccess'))
const Orders = lazy(() => import('../Pages/Orders'))
const OrderDetail = lazy(() => import('../Pages/OrderDetail'))
const Account = lazy(() => import('../Pages/Account'))
const NotFound = lazy(() => import('../Pages/NotFound'))

const PageFallback = () => <div className="page-section container"><div className="page-loader">Loading EasyBuy…</div></div>

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/mens" element={<Products category="men" />} />
          <Route path="/womens" element={<Products category="women" />} />
          <Route path="/kids" element={<Products category="kids" />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
