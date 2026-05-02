
import './App.css'
import {Route, Routes} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import LoginSignup from './Pages/LoginSignup'
import Shop from './Pages/Shop'
import Product from './Pages/Product'
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart'
import Footer from './Components/Footer/Footer'
import men_banner from "./assets/man--banner.png"
import women_banner from "./assets/woman-banner.jpg"
import kids_banner from "./assets/kids-banner.jpg"


function App() {
  

  return (
    <div>
        
      <Navbar /> 

      <Routes>
        <Route path='/' element={<Shop />} /> 
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} /> 
        <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>} /> 
        <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>} /> 
        <Route path='/product' element={<Product/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart />}/>
        <Route path='/login' element={<LoginSignup />}/>
      </Routes>
      <Footer />
      
    </div>
  )
}

export default App
