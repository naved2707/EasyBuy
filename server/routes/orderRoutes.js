import { Router } from 'express'
import { createOrder, getOrder, listOrders } from '../controllers/orderController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)
router.route('/').get(listOrders).post(createOrder)
router.get('/:orderId', getOrder)
export default router
