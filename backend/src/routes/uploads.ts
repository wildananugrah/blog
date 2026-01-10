import { Hono } from 'hono'
import { adminGuard } from '../middleware/adminGuard'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const uploads = new Hono()

const UPLOADS_DIR = path.join(process.cwd(), '..', 'data', 'uploads')

const ensureDir = async () => {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true })
  }
}

// POST /api/uploads/image - Upload image for Editor.js
uploads.post('/image', adminGuard, async (c) => {
  await ensureDir()

  const formData = await c.req.formData()
  const file = formData.get('image') as File | null

  if (!file) {
    return c.json({
      success: 0,
      error: 'No image file provided',
    })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return c.json({
      success: 0,
      error: 'Invalid file type. Allowed: jpeg, png, gif, webp',
    })
  }

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${uuidv4()}.${ext}`
  const filePath = path.join(UPLOADS_DIR, filename)

  // Save file
  const buffer = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(buffer))

  // Return Editor.js expected format
  return c.json({
    success: 1,
    file: {
      url: `/api/uploads/${filename}`,
    },
  })
})

// GET /api/uploads/:filename - Serve uploaded images
uploads.get('/:filename', async (c) => {
  const filename = c.req.param('filename')
  const filePath = path.join(UPLOADS_DIR, filename)

  if (!existsSync(filePath)) {
    return c.json({ error: 'File not found' }, 404)
  }

  const file = Bun.file(filePath)
  const buffer = await file.arrayBuffer()

  // Determine content type from extension
  const ext = filename.split('.').pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  }

  return new Response(buffer, {
    headers: {
      'Content-Type': contentTypes[ext || 'jpg'] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
})

export default uploads
