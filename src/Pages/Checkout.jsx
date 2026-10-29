import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../Components/common/EmptyState'
import { useAuth } from '../Context/AuthContext'
import { useShop } from '../Context/ShopContext'
import { useToast } from '../Context/ToastContext'
import { orderService } from '../services/orderService'
import { formatCurrency } from '../utils/currency'

const steps = ['Shipping Address', 'Delivery Method', 'Payment Method', 'Order Review']
const initialAddress = { fullName: '', phone: '', address: '', city: '', state: 'Maharashtra', pincode: '' }

export default function Checkout() {
  const { cartDetails, subtotal, shipping, discount, clearCart, coupon } = useShop()
  const { user, token } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState(() => ({ ...initialAddress, fullName: user?.name || '' }))
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)

  const deliveryCharge = delivery === 'express' ? 149 : shipping
  const payable = useMemo(() => Math.max(0, subtotal + deliveryCharge - discount), [subtotal, deliveryCharge, discount])

  if (!cartDetails.length) return <div className="page-section container"><EmptyState title="Nothing to checkout" message="Your cart is empty. Add products before starting checkout." /></div>

  const validateAddress = () => {
    const next = {}
    if (address.fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) next.phone = 'Enter a valid 10-digit phone number.'
    if (address.address.trim().length < 8) next.address = 'Enter a complete address.'
    if (!address.city.trim()) next.city = 'City is required.'
    if (!address.state.trim()) next.state = 'State is required.'
    if (!/^\d{6}$/.test(address.pincode)) next.pincode = 'Enter a valid 6-digit PIN code.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => {
    if (step === 0 && !validateAddress()) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const order = await orderService.create({
        items: cartDetails.map(({ product, quantity, size, color }) => ({ productId: product.id, title: product.title, image: product.images[0], price: product.price, quantity, size, color })),
        shippingAddress: address,
        deliveryMethod: delivery,
        paymentMethod: payment,
        subtotal,
        shipping: deliveryCharge,
        discount,
        coupon: coupon?.code || '',
        total: payable,
        customer: user ? { id: user.id || user._id, name: user.name, email: user.email } : null,
      }, token)
      clearCart()
      notify('Order placed successfully.')
      navigate(`/order-success/${order._id}`, { state: { order }, replace: true })
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="page-section container checkout-page">
      <div className="page-title-row"><div><span className="eyebrow">SECURE DEMO CHECKOUT</span><h1>Checkout</h1><p>No real payment will be processed.</p></div></div>
      <ol className="checkout-steps">{steps.map((label, index) => <li key={label} className={index === step ? 'active' : index < step ? 'done' : ''}><span>{index < step ? '✓' : index + 1}</span><b>{label}</b></li>)}</ol>
      <div className="checkout-layout">
        <section className="checkout-panel">
          {step === 0 && <div><h2>Shipping address</h2><div className="form-grid two-col">{[
            ['fullName', 'Full name'], ['phone', 'Phone'], ['address', 'Address'], ['city', 'City'], ['state', 'State'], ['pincode', 'PIN code'],
          ].map(([key, label]) => <label key={key} className={key === 'address' ? 'span-2' : ''}>{label}<input className={`input ${errors[key] ? 'input-error' : ''}`} value={address[key]} onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))} />{errors[key] && <small className="field-error">{errors[key]}</small>}</label>)}</div></div>}
          {step === 1 && <div><h2>Delivery method</h2><div className="choice-list"><label className={delivery === 'standard' ? 'selected' : ''}><input type="radio" name="delivery" value="standard" checked={delivery === 'standard'} onChange={(event) => setDelivery(event.target.value)} /><div><strong>Standard delivery</strong><span>3–5 business days</span></div><b>{shipping ? formatCurrency(shipping) : 'Free'}</b></label><label className={delivery === 'express' ? 'selected' : ''}><input type="radio" name="delivery" value="express" checked={delivery === 'express'} onChange={(event) => setDelivery(event.target.value)} /><div><strong>Express delivery</strong><span>1–2 business days</span></div><b>{formatCurrency(149)}</b></label></div></div>}
          {step === 2 && <div><h2>Payment method</h2><p className="muted">These are demonstration payment choices. No payment gateway is integrated.</p><div className="choice-list"><label className={payment === 'cod' ? 'selected' : ''}><input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={(event) => setPayment(event.target.value)} /><div><strong>Cash on Delivery</strong><span>Pay when your demo order arrives</span></div></label><label className={payment === 'card' ? 'selected' : ''}><input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={(event) => setPayment(event.target.value)} /><div><strong>Card (demo UI)</strong><span>No card details are collected</span></div></label><label className={payment === 'upi' ? 'selected' : ''}><input type="radio" name="payment" value="upi" checked={payment === 'upi'} onChange={(event) => setPayment(event.target.value)} /><div><strong>UPI (demo UI)</strong><span>No UPI request is created</span></div></label></div>{payment === 'card' && <div className="demo-payment-panel"><strong>Card UI preview</strong><p>Disabled sample fields show the intended payment layout without collecting real card data.</p><div className="payment-preview-grid"><input className="input" disabled value="4242 4242 4242 4242" aria-label="Demo card number" /><input className="input" disabled value="12/30" aria-label="Demo expiry" /><input className="input" disabled value="123" aria-label="Demo CVV" /></div></div>}{payment === 'upi' && <div className="demo-payment-panel"><strong>UPI UI preview</strong><p>No collect request or verification happens in this project.</p><input className="input" disabled value="demo@upi" aria-label="Demo UPI ID" /></div>}</div>}
          {step === 3 && <div><h2>Review your order</h2><div className="review-address"><strong>Deliver to</strong><p>{address.fullName}, {address.phone}</p><p>{address.address}, {address.city}, {address.state} - {address.pincode}</p></div><div className="review-items">{cartDetails.map(({ key, product, quantity, size, color }) => <div key={key}><img src={product.images[0]} alt="" /><span><strong>{product.title}</strong><small>{size}{size && color ? ' · ' : ''}{color} · Qty {quantity}</small></span><b>{formatCurrency(product.price * quantity)}</b></div>)}</div><div className="review-address"><strong>Payment</strong><p>{payment === 'cod' ? 'Cash on Delivery' : payment === 'card' ? 'Card — demo only' : 'UPI — demo only'}</p></div></div>}
          <div className="checkout-buttons">{step > 0 && <button className="btn btn-outline" type="button" onClick={() => setStep((current) => current - 1)}>Back</button>}{step < steps.length - 1 ? <button className="btn btn-primary" type="button" onClick={nextStep}>Continue</button> : <button className="btn btn-primary" type="button" disabled={placing} onClick={placeOrder}>{placing ? 'Placing order…' : 'Place order'}</button>}</div>
        </section>
        <aside className="order-summary-card checkout-summary"><h2>Summary</h2><div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</strong></div>{discount > 0 && <div className="summary-line discount-line"><span>Discount</span><strong>−{formatCurrency(discount)}</strong></div>}<div className="summary-total"><span>Payable</span><strong>{formatCurrency(payable)}</strong></div>{!user && <p className="small-note">Checking out as guest. <Link to="/login">Login</Link> to keep orders in your account when the backend is connected.</p>}</aside>
      </div>
    </div>
  )
}
