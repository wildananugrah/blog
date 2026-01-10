import { Link } from 'react-router-dom'
import type { ArticleSummary } from '../types'

interface ArticleListProps {
  articles: ArticleSummary[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No articles yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <article
          key={article.slug}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
        >
          <Link to={`/article/${article.slug}`}>
            <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 mb-2">
              {article.title}
            </h2>
          </Link>
          {article.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <time className="text-sm text-gray-400">
              {new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </article>
      ))}
    </div>
  )
}
