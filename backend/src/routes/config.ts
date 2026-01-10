import { Hono } from 'hono'
import { isAdminMode } from '../middleware/adminGuard'

const config = new Hono()

config.get('/', (c) => {
  return c.json({
    adminMode: isAdminMode(),
  })
})

export default config
