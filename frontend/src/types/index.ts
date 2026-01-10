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

// Article without content (for list views)
export type ArticleSummary = ArticleMetadata

export interface PdfMetadata {
  id: string
  filename: string
  title: string
  tags: string[]
  uploadedAt: string
}

export interface AppConfig {
  adminMode: boolean
}

export interface ArticleQuery {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

export interface PaginatedArticles {
  articles: ArticleSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
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
