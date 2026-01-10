import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import articles from './routes/articles'
import pdfs from './routes/pdfs'
import infographics from './routes/infographics'
import config from './routes/config'
import uploads from './routes/uploads'

const app = new Hono()

// Parse CORS origins from env
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000']

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: corsOrigins,
  credentials: true,
}))

// Routes
app.route('/api/articles', articles)
app.route('/api/pdfs', pdfs)
app.route('/api/infographics', infographics)
app.route('/api/config', config)
app.route('/api/uploads', uploads)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = parseInt(process.env.PORT || '3001')

console.log(`Server running on http://localhost:${port}`)
console.log(`Admin mode: ${process.env.ADMIN_MODE === 'true' ? 'enabled' : 'disabled'}`)

export default {
  port,
  fetch: app.fetch,
}
