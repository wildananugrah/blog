import { Link } from 'react-router-dom'
import type { PdfMetadata } from '../types'

interface PdfListProps {
  pdfs: PdfMetadata[]
}

export default function PdfList({ pdfs }: PdfListProps) {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No PDFs uploaded yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pdfs.map((pdf) => (
        <Link
          key={pdf.id}
          to={`/pdf/${pdf.id}`}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{pdf.title}</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {pdf.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <time className="text-xs text-gray-400 mt-2 block">
                {new Date(pdf.uploadedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
