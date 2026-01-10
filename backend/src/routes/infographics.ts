import { Hono } from 'hono'
import { adminGuard } from '../middleware/adminGuard'
import * as infographicService from '../services/infographicService'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

const infographics = new Hono()

// GET /api/infographics - List infographics with search and pagination
infographics.get('/', async (c) => {
  const search = c.req.query('search') || undefined
  const tag = c.req.query('tag') || undefined
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '12')

  const result = await infographicService.getAllInfographics({ search, tag, page, limit })
  return c.json(result)
})

// GET /api/infographics/:id - Get infographic image
infographics.get('/:id', async (c) => {
  const id = c.req.param('id')
  const infographic = await infographicService.getInfographicById(id)

  if (!infographic) {
    return c.json({ error: 'Infographic not found' }, 404)
  }

  const filePath = infographicService.getInfographicPath(infographic.filename)

  if (!existsSync(filePath)) {
    return c.json({ error: 'Infographic file not found' }, 404)
  }

  const fileBuffer = await readFile(filePath)
  const ext = infographic.filename.split('.').pop()?.toLowerCase()

  const contentTypeMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }

  const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  })
})

// GET /api/infographics/:id/metadata - Get infographic metadata only
infographics.get('/:id/metadata', async (c) => {
  const id = c.req.param('id')
  const infographic = await infographicService.getInfographicById(id)

  if (!infographic) {
    return c.json({ error: 'Infographic not found' }, 404)
  }

  return c.json(infographic)
})

// POST /api/infographics - Upload infographic (admin only)
infographics.post('/', adminGuard, async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  const title = formData.get('title') as string | null
  const description = formData.get('description') as string | ''
  const tagsStr = formData.get('tags') as string | null

  if (!file || !title) {
    return c.json({ error: 'File and title are required' }, 400)
  }

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

  if (!allowedExtensions.includes(ext)) {
    return c.json({ error: 'Only image files are allowed (png, jpg, jpeg, gif, webp, svg)' }, 400)
  }

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []

  const infographic = await infographicService.uploadInfographic(file, title, description || '', tags)
  return c.json(infographic, 201)
})

// DELETE /api/infographics/:id - Delete infographic (admin only)
infographics.delete('/:id', adminGuard, async (c) => {
  const id = c.req.param('id')
  const deleted = await infographicService.deleteInfographic(id)

  if (!deleted) {
    return c.json({ error: 'Infographic not found' }, 404)
  }

  return c.json({ success: true })
})

export default infographics
