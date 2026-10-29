import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!token) return res.status(401).json({ message: 'Authentication required.' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'User no longer exists.' })

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' })
  }
}
