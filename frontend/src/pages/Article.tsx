import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticle } from '../api/client'
import ArticleView from '../components/ArticleView'
import type { Article } from '../types'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    getArticle(slug)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          ← Back to articles
        </Link>
      </div>
    )
  }

  return (
    <article>
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        ← Back to articles
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.tags.length > 0 && (
            <div className="flex gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <ArticleView content={article.content} />
      </div>
    </article>
  )
}
