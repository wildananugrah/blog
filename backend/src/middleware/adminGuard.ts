import { Context, Next } from 'hono'

export const isAdminMode = (): boolean => {
  return process.env.ADMIN_MODE === 'true'
}

export const adminGuard = async (c: Context, next: Next) => {
  if (!isAdminMode()) {
    return c.json({ error: 'Admin mode is disabled' }, 403)
  }
  await next()
}
