import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPdfs, uploadPdf, deletePdf, getInfographics, uploadInfographic, deleteInfographic, getInfographicUrl } from '../api/client'
import { useAdmin } from '../hooks/useAdmin'
import type { PdfMetadata, PaginatedPdfs, InfographicMetadata, PaginatedInfographics } from '../types'

export default function Admin() {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const navigate = useNavigate()

  // PDFs state
  const [pdfsData, setPdfsData] = useState<PaginatedPdfs | null>(null)
  const [pdfsLoading, setPdfsLoading] = useState(true)
  const [pdfSearch, setPdfSearch] = useState('')
  const [pdfSearchInput, setPdfSearchInput] = useState('')
  const [pdfPage, setPdfPage] = useState(1)

  // PDF Upload state
  const [uploading, setUploading] = useState(false)
  const [pdfTitle, setPdfTitle] = useState('')
  const [pdfTags, setPdfTags] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  // Infographics state
  const [infographicsData, setInfographicsData] = useState<PaginatedInfographics | null>(null)
  const [infographicsLoading, setInfographicsLoading] = useState(true)
  const [infographicSearch, setInfographicSearch] = useState('')
  const [infographicSearchInput, setInfographicSearchInput] = useState('')
  const [infographicPage, setInfographicPage] = useState(1)

  // Infographic Upload state
  const [uploadingInfographic, setUploadingInfographic] = useState(false)
  const [infographicTitle, setInfographicTitle] = useState('')
  const [infographicDescription, setInfographicDescription] = useState('')
  const [infographicTags, setInfographicTags] = useState('')
  const [infographicFile, setInfographicFile] = useState<File | null>(null)

  const fetchPdfs = useCallback(async () => {
    setPdfsLoading(true)
    try {
      const result = await getPdfs({
        search: pdfSearch || undefined,
        page: pdfPage,
        limit: 10,
      })
      setPdfsData(result)
    } finally {
      setPdfsLoading(false)
    }
  }, [pdfSearch, pdfPage])

  const fetchInfographics = useCallback(async () => {
    setInfographicsLoading(true)
    try {
      const result = await getInfographics({
        search: infographicSearch || undefined,
        page: infographicPage,
        limit: 10,
      })
      setInfographicsData(result)
    } finally {
      setInfographicsLoading(false)
    }
  }, [infographicSearch, infographicPage])

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, adminLoading, navigate])

  useEffect(() => {
    if (isAdmin) {
      fetchPdfs()
      fetchInfographics()
    }
  }, [isAdmin, fetchPdfs, fetchInfographics])

  const handlePdfSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPdfSearch(pdfSearchInput)
    setPdfPage(1)
  }

  const handleClearPdfSearch = () => {
    setPdfSearchInput('')
    setPdfSearch('')
    setPdfPage(1)
  }

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfFile || !pdfTitle.trim()) return

    setUploading(true)
    try {
      const tags = pdfTags.split(',').map((t) => t.trim()).filter(Boolean)
      await uploadPdf(pdfFile, pdfTitle.trim(), tags)
      setPdfTitle('')
      setPdfTags('')
      setPdfFile(null)
      fetchPdfs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePdf = async (id: string) => {
    if (!confirm('Delete this PDF?')) return
    try {
      await deletePdf(id)
      fetchPdfs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // Infographic handlers
  const handleInfographicSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setInfographicSearch(infographicSearchInput)
    setInfographicPage(1)
  }

  const handleClearInfographicSearch = () => {
    setInfographicSearchInput('')
    setInfographicSearch('')
    setInfographicPage(1)
  }

  const handleUploadInfographic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!infographicFile || !infographicTitle.trim()) return

    setUploadingInfographic(true)
    try {
      const tags = infographicTags.split(',').map((t) => t.trim()).filter(Boolean)
      await uploadInfographic(infographicFile, infographicTitle.trim(), infographicDescription.trim(), tags)
      setInfographicTitle('')
      setInfographicDescription('')
      setInfographicTags('')
      setInfographicFile(null)
      fetchInfographics()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingInfographic(false)
    }
  }

  const handleDeleteInfographic = async (id: string) => {
    if (!confirm('Delete this infographic?')) return
    try {
      await deleteInfographic(id)
      fetchInfographics()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  if (adminLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const pdfs = pdfsData?.pdfs || []
  const pdfTotalPages = pdfsData?.totalPages || 1
  const pdfTotal = pdfsData?.total || 0

  const infographics = infographicsData?.infographics || []
  const infographicTotalPages = infographicsData?.totalPages || 1
  const infographicTotal = infographicsData?.total || 0

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin</h1>

      {/* Info about articles */}
      <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Articles</h2>
        <p className="text-gray-600 text-sm mb-3">
          Articles are managed in <code className="bg-gray-200 px-1 rounded">data/articles/</code>.
          Add metadata to <code className="bg-gray-200 px-1 rounded">index.json</code> and create a <code className="bg-gray-200 px-1 rounded">.md</code> file.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">index.json format:</p>
            <div className="p-3 bg-white rounded border text-sm font-mono text-gray-700 overflow-x-auto">
              <pre>{`{
  "articles": [
    {
      "slug": "my-article",
      "filename": "my-article.md",
      "title": "My Article Title",
      "excerpt": "A short description",
      "tags": ["tag1", "tag2"],
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}`}</pre>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">my-article.md:</p>
            <div className="p-3 bg-white rounded border text-sm font-mono text-gray-700 overflow-x-auto">
              <pre>{`# My Article Title

Your markdown content here...

## Subheading

More content with **bold** and *italic*.`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Upload Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload PDF</h2>
        <form onSubmit={handleUploadPdf} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={pdfTitle}
              onChange={(e) => setPdfTitle(e.target.value)}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="PDF title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={pdfTags}
              onChange={(e) => setPdfTags(e.target.value)}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !pdfFile || !pdfTitle.trim()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
      </section>

      {/* PDFs List Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">PDFs</h2>

        {/* PDF Search */}
        <form onSubmit={handlePdfSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={pdfSearchInput}
                onChange={(e) => setPdfSearchInput(e.target.value)}
                placeholder="Search PDFs..."
                className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {pdfSearchInput && (
                <button
                  type="button"
                  onClick={handleClearPdfSearch}
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

        {/* PDF Search Results Info */}
        {pdfSearch && !pdfsLoading && (
          <div className="mb-4 text-sm text-gray-600">
            {pdfTotal} result{pdfTotal !== 1 ? 's' : ''} found for "{pdfSearch}"
          </div>
        )}

        {pdfsLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-gray-500">No PDFs found.</p>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {pdfs.map((pdf: PdfMetadata) => (
                <div key={pdf.id} className="p-4 flex items-center justify-between">
                  <div>
                    <Link
                      to={`/pdf/${pdf.id}`}
                      className="font-medium text-gray-900 hover:text-gray-700"
                    >
                      {pdf.title}
                    </Link>
                    <p className="text-sm text-gray-500">{pdf.filename}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="text-sm text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* PDF Pagination */}
            {pdfTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                  disabled={pdfPage === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: pdfTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPdfPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        pdfPage === p
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPdfPage((p) => Math.min(pdfTotalPages, p + 1))}
                  disabled={pdfPage === pdfTotalPages}
                  className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Infographic Upload Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Infographic</h2>
        <form onSubmit={handleUploadInfographic} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
              onChange={(e) => setInfographicFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={infographicTitle}
              onChange={(e) => setInfographicTitle(e.target.value)}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Infographic title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={infographicDescription}
              onChange={(e) => setInfographicDescription(e.target.value)}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="A brief description..."
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={infographicTags}
              onChange={(e) => setInfographicTags(e.target.value)}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <button
            type="submit"
            disabled={uploadingInfographic || !infographicFile || !infographicTitle.trim()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingInfographic ? 'Uploading...' : 'Upload Infographic'}
          </button>
        </form>
      </section>

      {/* Infographics List Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Infographics</h2>

        {/* Infographic Search */}
        <form onSubmit={handleInfographicSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={infographicSearchInput}
                onChange={(e) => setInfographicSearchInput(e.target.value)}
                placeholder="Search infographics..."
                className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {infographicSearchInput && (
                <button
                  type="button"
                  onClick={handleClearInfographicSearch}
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

        {/* Infographic Search Results Info */}
        {infographicSearch && !infographicsLoading && (
          <div className="mb-4 text-sm text-gray-600">
            {infographicTotal} result{infographicTotal !== 1 ? 's' : ''} found for "{infographicSearch}"
          </div>
        )}

        {infographicsLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : infographics.length === 0 ? (
          <p className="text-gray-500">No infographics found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {infographics.map((item: InfographicMetadata) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <Link to={`/infographic/${item.id}`}>
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={getInfographicUrl(item.id)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <button
                      onClick={() => handleDeleteInfographic(item.id)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Infographic Pagination */}
            {infographicTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setInfographicPage((p) => Math.max(1, p - 1))}
                  disabled={infographicPage === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: infographicTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setInfographicPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        infographicPage === p
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setInfographicPage((p) => Math.min(infographicTotalPages, p + 1))}
                  disabled={infographicPage === infographicTotalPages}
                  className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
