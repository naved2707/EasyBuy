import { Link } from 'react-router-dom'
import heroImage from '../assets/men.webp'
import menBanner from '../assets/category-men.webp'
import womenBanner from '../assets/category-women.webp'
import kidsBanner from '../assets/category-kids.webp'
import ProductGrid from '../Components/common/ProductGrid'
import { useShop } from '../Context/ShopContext'
import { useToast } from '../Context/ToastContext'

export default function Home() {
  const { products } = useShop()
  const { notify } = useToast()
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const newArrivals = [...products].filter((product) => product.newArrival).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4)

  const categories = [
    { label: 'Men', to: '/mens', image: menBanner },
    { label: 'Women', to: '/womens', image: womenBanner },
    { label: 'Kids', to: '/kids', image: kidsBanner },
  ]

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">NEW SEASON · EASY STYLE</span>
            <h1>Everyday fashion, made easier.</h1>
            <p>Discover curated clothing for men, women and kids with smart prices, simple shopping and a modern experience.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/products">Shop collection</Link>
              <Link className="btn btn-ghost" to="/products?sort=newest">New arrivals →</Link>
            </div>
            <div className="hero-trust">
              <span>✓ Easy returns</span><span>✓ Secure account</span><span>✓ Free shipping ₹999+</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-card"><img src={heroImage} alt="EasyBuy new season menswear" /></div>
            <div className="floating-offer"><strong>10% OFF</strong><span>Use EASY10</span></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Find your style</h2></div></div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link to={category.to} className="category-card" key={category.label}>
              <img src={category.image} alt={`${category.label} collection`} loading="lazy" />
              <div><h3>{category.label}</h3><span>Shop now →</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Featured products</h2></div><Link to="/products">View all →</Link></div>
        <ProductGrid products={featured} />
      </section>

      <section className="promo-band">
        <div className="container promo-content">
          <div><span className="eyebrow">WEEKEND EDIT</span><h2>Refresh your wardrobe without overthinking it.</h2></div>
          <Link className="btn btn-light" to="/products?sort=popular">Explore best sellers</Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">JUST DROPPED</span><h2>New arrivals</h2></div><Link to="/products?sort=newest">See newest →</Link></div>
        <ProductGrid products={newArrivals} />
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">CUSTOMER FAVOURITES</span><h2>Best sellers</h2></div></div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="newsletter-section container">
        <div><span className="eyebrow">STAY IN THE LOOP</span><h2>Offers, launches and style updates.</h2><p>This demo form validates the email and shows the interaction without sending marketing email.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); notify('Thanks! Newsletter signup is a demo interaction.', 'info'); event.currentTarget.reset() }} className="newsletter-form">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" required placeholder="you@example.com" />
          <button className="btn btn-primary" type="submit">Subscribe</button>
        </form>
      </section>
    </>
  )
}
