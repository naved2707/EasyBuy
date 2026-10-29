import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/shopping-logo-bg-r.png'
import { useShop } from '../../Context/ShopContext'
import { useAuth } from '../../Context/AuthContext'
import useDebounce from '../../hooks/useDebounce'
import { productService } from '../../services/productService'

export default function Navbar() {
  const { cartCount, wishlistCount } = useShop()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 250)
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let active = true
    productService.search(debouncedQuery).then((items) => {
      if (active) setSuggestions(items)
    })
    return () => {
      active = false
    }
  }, [debouncedQuery])

  useEffect(() => {
    const close = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products')
    setSearchOpen(false)
  }

  return (
    <header className="site-header">
      <div className="announcement">Free shipping on orders above ₹999 · Use EASY10 for 10% off</div>
      <div className="navbar container-wide">
        <Link className="brand" to="/" aria-label="EasyBuy home">
          <img src={logo} alt="" />
          <span>EasyBuy</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/mens">Men</NavLink>
          <NavLink to="/womens">Women</NavLink>
          <NavLink to="/kids">Kids</NavLink>
          {user ? <NavLink className="nav-mobile-only" to="/account">Account</NavLink> : <NavLink className="nav-mobile-only" to="/login">Login</NavLink>}
        </nav>

        <form className="nav-search" onSubmit={submitSearch} ref={searchRef} role="search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search products, brands..."
            aria-label="Search products"
          />
          {searchOpen && query.trim() && (
            <div className="search-suggestions">
              {suggestions.length ? suggestions.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img src={product.images[0]} alt="" />
                  <span><strong>{product.title}</strong><small>{product.brand} · {product.category}</small></span>
                </button>
              )) : <p>No matching products found.</p>}
              <button type="submit" className="view-search-results">View all results for “{query.trim()}”</button>
            </div>
          )}
        </form>

        <div className="nav-actions">
          <Link className="nav-icon-link" to="/wishlist" aria-label={`Wishlist with ${wishlistCount} items`}>
            <span aria-hidden="true">♡</span><b>{wishlistCount}</b>
          </Link>
          <Link className="nav-icon-link" to="/cart" aria-label={`Cart with ${cartCount} items`}>
            <span aria-hidden="true">🛍</span><b>{cartCount}</b>
          </Link>
          {user ? (
            <div className="account-menu">
              <Link to="/account" className="account-chip">Hi, {user.name.split(' ')[0]}</Link>
              <button type="button" onClick={logout} className="text-button">Logout</button>
            </div>
          ) : (
            <Link className="btn btn-outline nav-login" to="/login">Login</Link>
          )}
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            ☰
          </button>
        </div>
      </div>
      <form className="mobile-search container-wide" onSubmit={submitSearch} role="search">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search EasyBuy" aria-label="Search products" />
        <button type="submit">Search</button>
      </form>
    </header>
  )
}
