import { Hono } from 'hono'
import { adminGuard } from '../middleware/adminGuard'
import * as pdfService from '../services/pdfService'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

const pdfs = new Hono()

// GET /api/pdfs - List PDFs with search and pagination
pdfs.get('/', async (c) => {
  const search = c.req.query('search') || undefined
  const tag = c.req.query('tag') || undefined
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')

  const result = await pdfService.getAllPdfs({ search, tag, page, limit })
  return c.json(result)
})

// GET /api/pdfs/:id - Get PDF file
pdfs.get('/:id', async (c) => {
  const id = c.req.param('id')
  const pdf = await pdfService.getPdfById(id)

  if (!pdf) {
    return c.json({ error: 'PDF not found' }, 404)
  }

  const filePath = pdfService.getPdfPath(pdf.filename)

  if (!existsSync(filePath)) {
    return c.json({ error: 'PDF file not found' }, 404)
  }

  const fileBuffer = await readFile(filePath)

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pdf.title}.pdf"`,
    },
  })
})

// GET /api/pdfs/:id/metadata - Get PDF metadata only
pdfs.get('/:id/metadata', async (c) => {
  const id = c.req.param('id')
  const pdf = await pdfService.getPdfById(id)

  if (!pdf) {
    return c.json({ error: 'PDF not found' }, 404)
  }

  return c.json(pdf)
})

// POST /api/pdfs - Upload PDF (admin only)
pdfs.post('/', adminGuard, async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  const title = formData.get('title') as string | null
  const tagsStr = formData.get('tags') as string | null

  if (!file || !title) {
    return c.json({ error: 'File and title are required' }, 400)
  }

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return c.json({ error: 'Only PDF files are allowed' }, 400)
  }

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []

  const pdf = await pdfService.uploadPdf(file, title, tags)
  return c.json(pdf, 201)
})

// DELETE /api/pdfs/:id - Delete PDF (admin only)
pdfs.delete('/:id', adminGuard, async (c) => {
  const id = c.req.param('id')
  const deleted = await pdfService.deletePdf(id)

  if (!deleted) {
    return c.json({ error: 'PDF not found' }, 404)
  }

  return c.json({ success: true })
})

export default pdfs
