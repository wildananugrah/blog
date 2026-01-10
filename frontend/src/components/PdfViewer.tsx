import { useState } from 'react'
import { getPdfUrl } from '../api/client'

interface PdfViewerProps {
  pdfId: string
  title: string
}

export default function PdfViewer({ pdfId, title }: PdfViewerProps) {
  const [error, setError] = useState(false)
  const pdfUrl = getPdfUrl(pdfId)

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">Unable to display PDF in browser.</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-medium text-gray-900">{title}</h2>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Open in new tab
        </a>
      </div>
      <iframe
        src={pdfUrl}
        className="w-full h-[calc(100vh-200px)] min-h-[600px]"
        title={title}
        onError={() => setError(true)}
      />
    </div>
  )
}
