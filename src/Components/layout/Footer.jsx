import { Link } from 'react-router-dom'
import logo from '../../assets/shopping-logo-bg-r.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/"><img src={logo} alt="" /><span>EasyBuy</span></Link>
          <p>Simple, modern fashion shopping built as a portfolio-ready React e-commerce experience.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/mens">Men</Link><Link to="/womens">Women</Link><Link to="/kids">Kids</Link><Link to="/products">All products</Link>
        </div>
        <div>
          <h3>Account</h3>
          <Link to="/account">My account</Link><Link to="/orders">Orders</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link>
        </div>
        <div>
          <h3>Help</h3>
          <span>Shipping & returns</span><span>Size guide</span><span>Privacy</span><span>Contact</span>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 EasyBuy. Portfolio demo project.</span>
        <span>Cash on Delivery · Demo Card · Demo UPI</span>
      </div>
    </footer>
  )
}
