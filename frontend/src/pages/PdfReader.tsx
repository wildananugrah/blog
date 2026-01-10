import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPdfMetadata, deletePdf } from '../api/client'
import PdfViewer from '../components/PdfViewer'
import { useAdmin } from '../hooks/useAdmin'
import type { PdfMetadata } from '../types'

export default function PdfReader() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAdmin()
  const [pdf, setPdf] = useState<PdfMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return

    getPdfMetadata(id)
      .then(setPdf)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this PDF?')) return

    setDeleting(true)
    try {
      await deletePdf(id)
      navigate('/pdfs')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !pdf) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'PDF not found'}</p>
        <Link to="/pdfs" className="text-gray-600 hover:text-gray-900">
          ← Back to PDFs
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/pdfs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to PDFs
        </Link>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete PDF'}
          </button>
        )}
      </div>

      <PdfViewer pdfId={pdf.id} title={pdf.title} />
    </div>
  )
}
