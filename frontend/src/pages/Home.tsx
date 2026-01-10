import { useState, useEffect, useCallback } from 'react'
import { getArticles } from '../api/client'
import ArticleList from '../components/ArticleList'
import { SEO, WebsiteJsonLd } from '../components/SEO'
import type { PaginatedArticles } from '../types'

export default function Home() {
  const [data, setData] = useState<PaginatedArticles | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [allTags, setAllTags] = useState<string[]>([])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getArticles({
        search: search || undefined,
        tag: selectedTag || undefined,
        page,
        limit: 10,
      })
      setData(result)

      // Collect all unique tags from articles for filter
      if (!search && !selectedTag && page === 1) {
        const tagSet = new Set<string>()
        result.articles.forEach((article) => {
          article.tags.forEach((tag) => tagSet.add(tag))
        })
        setAllTags(Array.from(tagSet).sort())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [search, selectedTag, page])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Fetch all tags on initial load
  useEffect(() => {
    getArticles({ limit: 100 }).then((result) => {
      const tagSet = new Set<string>()
      result.articles.forEach((article) => {
        article.tags.forEach((tag) => tagSet.add(tag))
      })
      setAllTags(Array.from(tagSet).sort())
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    setPage(1)
  }

  const articles = data?.articles || []
  const totalPages = data?.totalPages || 1
  const total = data?.total || 0

  const pageTitle = search
    ? `Search: ${search}`
    : selectedTag
      ? `Articles tagged "${selectedTag}"`
      : undefined

  const pageDescription = search
    ? `Search results for "${search}" - Find articles matching your query.`
    : selectedTag
      ? `Browse all articles tagged with "${selectedTag}". Discover insights on ${selectedTag}.`
      : 'Discover insightful articles on self-development, productivity, leadership, and technology. Learn from comprehensive guides and book summaries.'

  return (
    <div>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={allTags}
        url={`/${search ? `?search=${encodeURIComponent(search)}` : ''}${selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : ''}`}
      />
      <WebsiteJsonLd />

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Articles</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </form>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleTagSelect(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === tag
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Search Results Info */}
      {(search || selectedTag) && !loading && (
        <div className="mb-4 text-sm text-gray-600">
          {total} result{total !== 1 ? 's' : ''} found
          {search && <span> for "{search}"</span>}
          {selectedTag && <span> in tag "{selectedTag}"</span>}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <ArticleList articles={articles} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm ${
                      page === p
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
