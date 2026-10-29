import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { orderService } from '../services/orderService'
import { formatCurrency } from '../utils/currency'

const statuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

export default function OrderDetail() {
  const { orderId } = useParams()
  const { token, user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; orderService.getById(orderId, token, user?.id || user?._id).then((data) => { if (active) { setOrder(data); setLoading(false) } }); return () => { active = false } }, [orderId, token, user])
  if (loading) return <div className="page-section container"><div className="page-loader">Loading order…</div></div>
  if (!order) return <div className="page-section container"><div className="not-found-card"><h1>Order not found</h1><p>This order is not available in the connected account or local demo history.</p><Link className="btn btn-primary" to="/orders">Back to orders</Link></div></div>
  const currentIndex = statuses.indexOf(order.status)
  return <div className="page-section container"><div className="page-title-row"><div><span className="eyebrow">ORDER DETAILS</span><h1>{order._id}</h1><p>Placed {new Date(order.createdAt).toLocaleString('en-IN')}</p></div><Link className="text-link" to="/orders">← All orders</Link></div><div className="order-detail-grid"><section className="order-detail-card"><h2>Order status</h2>{order.status === 'Cancelled' ? <div className="form-alert error">This order was cancelled.</div> : <div className="status-timeline">{statuses.map((status, index) => <div key={status} className={index <= currentIndex ? 'reached' : ''}><span>{index <= currentIndex ? '✓' : index + 1}</span><b>{status}</b></div>)}</div>}<h2>Items</h2><div className="review-items">{order.items?.map((item, index) => <div key={`${item.productId}-${index}`}><img src={item.image} alt="" /><span><strong>{item.title}</strong><small>{item.size}{item.size && item.color ? ' · ' : ''}{item.color} · Qty {item.quantity}</small></span><b>{formatCurrency(item.price * item.quantity)}</b></div>)}</div></section><aside className="order-summary-card"><h2>Delivery</h2><p>{order.shippingAddress?.fullName}</p><p>{order.shippingAddress?.address}</p><p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p><hr /><div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(order.subtotal)}</strong></div><div className="summary-line"><span>Shipping</span><strong>{order.shipping ? formatCurrency(order.shipping) : 'Free'}</strong></div>{order.discount > 0 && <div className="summary-line discount-line"><span>Discount</span><strong>−{formatCurrency(order.discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{formatCurrency(order.total)}</strong></div></aside></div></div>
}
