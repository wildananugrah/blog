import type { Article, PdfMetadata, AppConfig, ArticleQuery, PaginatedArticles, PdfQuery, PaginatedPdfs, InfographicMetadata, InfographicQuery, PaginatedInfographics } from '../types'

const API_BASE = '/api'

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

// Config
export const getConfig = () => fetchJSON<AppConfig>('/config')

// Articles (read-only - articles are .md files in data/articles/)
export const getArticles = (query?: ArticleQuery) => {
  const params = new URLSearchParams()
  if (query?.search) params.set('search', query.search)
  if (query?.tag) params.set('tag', query.tag)
  if (query?.page) params.set('page', query.page.toString())
  if (query?.limit) params.set('limit', query.limit.toString())

  const queryString = params.toString()
  return fetchJSON<PaginatedArticles>(`/articles${queryString ? `?${queryString}` : ''}`)
}

export const getArticle = (slug: string) => fetchJSON<Article>(`/articles/${slug}`)

// PDFs
export const getPdfs = (query?: PdfQuery) => {
  const params = new URLSearchParams()
  if (query?.search) params.set('search', query.search)
  if (query?.tag) params.set('tag', query.tag)
  if (query?.page) params.set('page', query.page.toString())
  if (query?.limit) params.set('limit', query.limit.toString())

  const queryString = params.toString()
  return fetchJSON<PaginatedPdfs>(`/pdfs${queryString ? `?${queryString}` : ''}`)
}

export const getPdfMetadata = (id: string) => fetchJSON<PdfMetadata>(`/pdfs/${id}/metadata`)

export const getPdfUrl = (id: string) => `${API_BASE}/pdfs/${id}`

export const uploadPdf = async (file: File, title: string, tags: string[]) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('tags', tags.join(','))

  const res = await fetch(`${API_BASE}/pdfs`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Upload failed')
  }

  return res.json() as Promise<PdfMetadata>
}

export const deletePdf = (id: string) =>
  fetchJSON<{ success: boolean }>(`/pdfs/${id}`, {
    method: 'DELETE',
  })

// Infographics
export const getInfographics = (query?: InfographicQuery) => {
  const params = new URLSearchParams()
  if (query?.search) params.set('search', query.search)
  if (query?.tag) params.set('tag', query.tag)
  if (query?.page) params.set('page', query.page.toString())
  if (query?.limit) params.set('limit', query.limit.toString())

  const queryString = params.toString()
  return fetchJSON<PaginatedInfographics>(`/infographics${queryString ? `?${queryString}` : ''}`)
}

export const getInfographicMetadata = (id: string) => fetchJSON<InfographicMetadata>(`/infographics/${id}/metadata`)

export const getInfographicUrl = (id: string) => `${API_BASE}/infographics/${id}`

export const uploadInfographic = async (file: File, title: string, description: string, tags: string[]) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('description', description)
  formData.append('tags', tags.join(','))

  const res = await fetch(`${API_BASE}/infographics`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Upload failed')
  }

  return res.json() as Promise<InfographicMetadata>
}

export const deleteInfographic = (id: string) =>
  fetchJSON<{ success: boolean }>(`/infographics/${id}`, {
    method: 'DELETE',
  })
