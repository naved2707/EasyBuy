import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

const app = express()
const port = Number(process.env.PORT) || 5000
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Add it to server/.env.')

app.disable('x-powered-by')
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map((item) => item.trim()) || true }))
app.use(express.json({ limit: '200kb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'EasyBuy API' }))
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Unexpected server error.' })
})


if (process.env.VERCEL) {
  await connectDatabase(process.env.MONGODB_URI)
} else {
  connectDatabase(process.env.MONGODB_URI)
    .then(() => app.listen(port, () => console.log(`EasyBuy API running on http://localhost:${port}`)))
    .catch((error) => {
      console.error('Could not start API:', error.message)
      process.exitCode = 1
    })
}

export default app
