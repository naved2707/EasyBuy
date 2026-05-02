import React, { useContext } from 'react'
import "./Navbar.css"
import logo from '../../assets/shopping-logo-bg-r.png'
import cart from '../../assets/cart.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
const Navbar = () => {

const{getTotalCartItems}=useContext(ShopContext)

    return (
        <div className='navbar'>

            <div className="nav-logo">
                <img src={logo} alt="shopping_Logo" height={55} />
                <p>EasyBuy</p>
            </div>
            <ul className='nav-menu'>
                <li><Link style={{textDecoration:"none", color: "rgb(97, 97, 97)"}} to="/">Home</Link></li>
                <li><Link style={{textDecoration:"none", color: "rgb(97, 97, 97)"}} to="/mens">Men</Link></li>
                <li><Link style={{textDecoration:"none", color: "rgb(97, 97, 97)"}} to="/womens">Women</Link></li>
                <li><Link style={{textDecoration:"none", color: "rgb(97, 97, 97)"}} to="/kids">Kids</Link></li>
            </ul>
            <div className="nav-login-cart">
                <Link to="login"> <button>Login</button> </Link>
                <Link to="/cart"> <img src={cart} alt="cart-icon" height={40} /> </Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>


        </div>
    )
}

export default Navbar
