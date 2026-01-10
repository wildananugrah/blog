import { readFile, writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface PdfMetadata {
  id: string
  filename: string
  title: string
  tags: string[]
  uploadedAt: string
}

export interface PdfQuery {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

export interface PaginatedPdfs {
  pdfs: PdfMetadata[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface PdfIndex {
  pdfs: PdfMetadata[]
}

const PDFS_DIR = path.join(process.cwd(), '..', 'data', 'pdfs')
const INDEX_FILE = path.join(PDFS_DIR, 'index.json')

const ensureDir = async () => {
  if (!existsSync(PDFS_DIR)) {
    await mkdir(PDFS_DIR, { recursive: true })
  }
}

const readIndex = async (): Promise<PdfIndex> => {
  await ensureDir()
  if (!existsSync(INDEX_FILE)) {
    return { pdfs: [] }
  }
  const content = await readFile(INDEX_FILE, 'utf-8')
  return JSON.parse(content)
}

const writeIndex = async (index: PdfIndex): Promise<void> => {
  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2))
}

export const getAllPdfs = async (query?: PdfQuery): Promise<PaginatedPdfs> => {
  const index = await readIndex()
  let pdfs = index.pdfs.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )

  // Filter by search (title)
  if (query?.search) {
    const searchLower = query.search.toLowerCase()
    pdfs = pdfs.filter((pdf) =>
      pdf.title.toLowerCase().includes(searchLower)
    )
  }

  // Filter by tag
  if (query?.tag) {
    pdfs = pdfs.filter((pdf) => pdf.tags.includes(query.tag!))
  }

  // Pagination
  const page = query?.page || 1
  const limit = query?.limit || 10
  const total = pdfs.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedPdfs = pdfs.slice(start, start + limit)

  return {
    pdfs: paginatedPdfs,
    total,
    page,
    limit,
    totalPages,
  }
}

export const getPdfById = async (id: string): Promise<PdfMetadata | null> => {
  const index = await readIndex()
  return index.pdfs.find(p => p.id === id) || null
}

export const getPdfPath = (filename: string): string => {
  return path.join(PDFS_DIR, filename)
}

export const uploadPdf = async (
  file: File,
  title: string,
  tags: string[]
): Promise<PdfMetadata> => {
  await ensureDir()

  const id = uuidv4()
  const ext = path.extname(file.name)
  const filename = `${id}${ext}`
  const filePath = path.join(PDFS_DIR, filename)

  const buffer = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(buffer))

  const metadata: PdfMetadata = {
    id,
    filename,
    title,
    tags,
    uploadedAt: new Date().toISOString(),
  }

  const index = await readIndex()
  index.pdfs.push(metadata)
  await writeIndex(index)

  return metadata
}

export const deletePdf = async (id: string): Promise<boolean> => {
  const index = await readIndex()
  const pdfIndex = index.pdfs.findIndex(p => p.id === id)

  if (pdfIndex === -1) return false

  const pdf = index.pdfs[pdfIndex]
  const filePath = path.join(PDFS_DIR, pdf.filename)

  if (existsSync(filePath)) {
    await unlink(filePath)
  }

  index.pdfs.splice(pdfIndex, 1)
  await writeIndex(index)

  return true
}
