import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getInfographicMetadata, getInfographicUrl } from '../api/client'
import type { InfographicMetadata } from '../types'

export default function InfographicViewer() {
  const { id } = useParams<{ id: string }>()
  const [infographic, setInfographic] = useState<InfographicMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    getInfographicMetadata(id)
      .then(setInfographic)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load infographic'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !infographic) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Infographic not found'}</p>
        <Link to="/infographics" className="text-gray-600 hover:text-gray-900">
          &larr; Back to Infographics
        </Link>
      </div>
    )
  }

  const imageUrl = getInfographicUrl(infographic.id)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/infographics" className="text-gray-600 hover:text-gray-900 text-sm mb-4 inline-block">
          &larr; Back to Infographics
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{infographic.title}</h1>
        {infographic.description && (
          <p className="text-gray-600 mb-4">{infographic.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {infographic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {new Date(infographic.uploadedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsFullscreen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Fullscreen
        </button>
        <a
          href={imageUrl}
          download={`${infographic.title}.${infographic.filename.split('.').pop()}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>

      {/* Image */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={infographic.title}
          className="w-full h-auto cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
        />
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={imageUrl}
            alt={infographic.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
