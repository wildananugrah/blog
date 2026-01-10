import { readFile, writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface InfographicMetadata {
  id: string
  filename: string
  title: string
  description: string
  tags: string[]
  uploadedAt: string
}

export interface InfographicQuery {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

export interface PaginatedInfographics {
  infographics: InfographicMetadata[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface InfographicIndex {
  infographics: InfographicMetadata[]
}

const INFOGRAPHICS_DIR = path.join(process.cwd(), '..', 'data', 'infographics')
const INDEX_FILE = path.join(INFOGRAPHICS_DIR, 'index.json')

const ensureDir = async () => {
  if (!existsSync(INFOGRAPHICS_DIR)) {
    await mkdir(INFOGRAPHICS_DIR, { recursive: true })
  }
}

const readIndex = async (): Promise<InfographicIndex> => {
  await ensureDir()
  if (!existsSync(INDEX_FILE)) {
    await writeFile(INDEX_FILE, JSON.stringify({ infographics: [] }, null, 2))
    return { infographics: [] }
  }
  const content = await readFile(INDEX_FILE, 'utf-8')
  return JSON.parse(content)
}

const writeIndex = async (index: InfographicIndex): Promise<void> => {
  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2))
}

export const getAllInfographics = async (query?: InfographicQuery): Promise<PaginatedInfographics> => {
  const index = await readIndex()
  let infographics = index.infographics.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )

  // Filter by search (title + description)
  if (query?.search) {
    const searchLower = query.search.toLowerCase()
    infographics = infographics.filter((item) =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Filter by tag
  if (query?.tag) {
    infographics = infographics.filter((item) => item.tags.includes(query.tag!))
  }

  // Pagination
  const page = query?.page || 1
  const limit = query?.limit || 12
  const total = infographics.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedInfographics = infographics.slice(start, start + limit)

  return {
    infographics: paginatedInfographics,
    total,
    page,
    limit,
    totalPages,
  }
}

export const getInfographicById = async (id: string): Promise<InfographicMetadata | null> => {
  const index = await readIndex()
  return index.infographics.find(i => i.id === id) || null
}

export const getInfographicPath = (filename: string): string => {
  return path.join(INFOGRAPHICS_DIR, filename)
}

export const uploadInfographic = async (
  file: File,
  title: string,
  description: string,
  tags: string[]
): Promise<InfographicMetadata> => {
  await ensureDir()

  const id = uuidv4()
  const ext = path.extname(file.name).toLowerCase()
  const filename = `${id}${ext}`
  const filePath = path.join(INFOGRAPHICS_DIR, filename)

  const buffer = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(buffer))

  const metadata: InfographicMetadata = {
    id,
    filename,
    title,
    description,
    tags,
    uploadedAt: new Date().toISOString(),
  }

  const index = await readIndex()
  index.infographics.push(metadata)
  await writeIndex(index)

  return metadata
}

export const deleteInfographic = async (id: string): Promise<boolean> => {
  const index = await readIndex()
  const itemIndex = index.infographics.findIndex(i => i.id === id)

  if (itemIndex === -1) return false

  const item = index.infographics[itemIndex]
  const filePath = path.join(INFOGRAPHICS_DIR, item.filename)

  if (existsSync(filePath)) {
    await unlink(filePath)
  }

  index.infographics.splice(itemIndex, 1)
  await writeIndex(index)

  return true
}
