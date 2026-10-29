import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })
const issueToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export async function register(req, res, next) {
  try {
    const { name = '', email = '', password = '' } = req.body
    if (name.trim().length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters.' })
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash })
    res.status(201).json({ user: publicUser(user), token: issueToken(user._id) })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' })
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const { email = '', password = '' } = req.body
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    res.json({ user: publicUser(user), token: issueToken(user._id) })
  } catch (error) {
    next(error)
  }
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) })
}
