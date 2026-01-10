import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface ArticleMetadata {
  slug: string
  filename: string
  title: string
  excerpt: string
  tags: string[]
  coverImage?: string
  createdAt: string
  updatedAt?: string
}

export interface Article extends ArticleMetadata {
  content: string // markdown content
}

export interface ArticleQuery {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

export interface PaginatedArticles {
  articles: ArticleMetadata[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ArticlesIndex {
  articles: ArticleMetadata[]
}

const DATA_DIR = path.join(process.cwd(), '..', 'data', 'articles')
const INDEX_FILE = path.join(DATA_DIR, 'index.json')

const ensureDir = async () => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

const readIndex = async (): Promise<ArticlesIndex> => {
  await ensureDir()
  if (!existsSync(INDEX_FILE)) {
    await writeFile(INDEX_FILE, JSON.stringify({ articles: [] }, null, 2))
    return { articles: [] }
  }
  const content = await readFile(INDEX_FILE, 'utf-8')
  return JSON.parse(content)
}

export const getAllArticles = async (query?: ArticleQuery): Promise<PaginatedArticles> => {
  const index = await readIndex()
  let articles = [...index.articles]

  // Sort by date (newest first)
  articles.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter by search (title + excerpt + tags)
  if (query?.search) {
    const searchLower = query.search.toLowerCase()
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower) ||
        a.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Filter by tag
  if (query?.tag) {
    articles = articles.filter((a) => a.tags.includes(query.tag!))
  }

  // Pagination
  const total = articles.length
  const page = query?.page || 1
  const limit = query?.limit || 10
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const paginatedArticles = articles.slice(startIndex, startIndex + limit)

  return {
    articles: paginatedArticles,
    total,
    page,
    limit,
    totalPages,
  }
}

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  const index = await readIndex()
  const metadata = index.articles.find(a => a.slug === slug)

  if (!metadata) {
    return null
  }

  const filePath = path.join(DATA_DIR, metadata.filename)
  if (!existsSync(filePath)) {
    return null
  }

  try {
    const content = await readFile(filePath, 'utf-8')
    return {
      ...metadata,
      content,
    }
  } catch {
    return null
  }
}
