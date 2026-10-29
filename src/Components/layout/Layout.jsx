import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from '../common/BackToTop'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main><Outlet /></main>
      <Footer />
      <BackToTop />
    </div>
  )
}
