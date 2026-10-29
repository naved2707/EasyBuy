import Order from '../models/Order.js'

export async function createOrder(req, res, next) {
  try {
    const payload = req.body
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return res.status(400).json({ message: 'Your order has no items.' })
    }

    const order = await Order.create({
      user: req.user._id,
      items: payload.items,
      shippingAddress: payload.shippingAddress,
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      discount: payload.discount || 0,
      coupon: payload.coupon || '',
      total: payload.total,
    })
    res.status(201).json({ order })
  } catch (error) {
    next(error)
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({ order })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Order not found.' })
    next(error)
  }
}
