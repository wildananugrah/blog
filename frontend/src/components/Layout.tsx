import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

export default function Layout() {
  const { isAdmin } = useAdmin()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Blog
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/') && !isActive('/pdfs') && !isActive('/infographics') && !isActive('/admin')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Articles
                </Link>
                <Link
                  to="/pdfs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/pdfs')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  PDFs
                </Link>
                <Link
                  to="/infographics"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/infographics') || isActive('/infographic/')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Infographics
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Admin Mode
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
