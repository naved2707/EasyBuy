import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { orderService } from '../services/orderService'
import { formatCurrency } from '../utils/currency'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const { token, user } = useAuth()
  const [order, setOrder] = useState(state?.order || null)

  useEffect(() => {
    if (order) return undefined
    let active = true
    orderService.getById(orderId, token, user?.id || user?._id).then((savedOrder) => {
      if (active) setOrder(savedOrder)
    })
    return () => { active = false }
  }, [order, orderId, token, user])

  return (
    <div className="page-section container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <span className="eyebrow">ORDER CONFIRMED</span>
        <h1>Thanks for your order!</h1>
        <p>Your EasyBuy demo order has been created successfully.</p>
        <div className="success-order-id"><span>Order ID</span><strong>{orderId}</strong></div>
        {order && <>
          <div className="review-items success-items">
            {order.items?.map((item, index) => (
              <div key={`${item.productId}-${index}`}>
                <img src={item.image} alt="" />
                <span><strong>{item.title}</strong><small>Qty {item.quantity}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}</small></span>
                <b>{formatCurrency(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="success-summary"><span>Total</span><strong>{formatCurrency(order.total)}</strong><span>Status</span><strong>{order.status || 'Confirmed'}</strong></div>
        </>}
        <div className="success-actions"><Link className="btn btn-primary" to={`/orders/${orderId}`}>View order</Link><Link className="btn btn-outline" to="/products">Continue shopping</Link></div>
      </div>
    </div>
  )
}
