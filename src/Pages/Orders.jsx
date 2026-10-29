import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../Components/common/EmptyState'
import { useAuth } from '../Context/AuthContext'
import { orderService } from '../services/orderService'
import { formatCurrency } from '../utils/currency'

export default function Orders() {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; orderService.getAll(token, user?.id || user?._id).then((data) => { if (active) { setOrders(data); setLoading(false) } }); return () => { active = false } }, [token, user])
  if (loading) return <div className="page-section container"><div className="page-loader">Loading orders…</div></div>
  if (!orders.length) return <div className="page-section container"><EmptyState title="No orders yet" message="When you place an order, it will appear here." /></div>
  return <div className="page-section container"><div className="page-title-row"><div><span className="eyebrow">ORDER HISTORY</span><h1>Your orders</h1></div></div><div className="orders-list">{orders.map((order) => <Link className="order-card" to={`/orders/${order._id}`} key={order._id}><div><span>Order</span><strong>{order._id}</strong><small>{new Date(order.createdAt).toLocaleDateString('en-IN')}</small></div><div><span>Status</span><strong className="status-pill">{order.status}</strong></div><div><span>Total</span><strong>{formatCurrency(order.total)}</strong></div><b>View →</b></Link>)}</div></div>
}
