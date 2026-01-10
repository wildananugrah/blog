import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminContext, useAdminProvider } from './hooks/useAdmin'
import Layout from './components/Layout'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Pdfs from './pages/Pdfs'
import PdfReader from './pages/PdfReader'
import Infographics from './pages/Infographics'
import InfographicViewer from './pages/InfographicViewer'
import Admin from './pages/Admin'

function App() {
  const adminContext = useAdminProvider()

  return (
    <AdminContext.Provider value={adminContext}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="pdfs" element={<Pdfs />} />
            <Route path="pdf/:id" element={<PdfReader />} />
            <Route path="infographics" element={<Infographics />} />
            <Route path="infographic/:id" element={<InfographicViewer />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminContext.Provider>
  )
}

export default App
