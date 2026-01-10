import { useState, useEffect, createContext, useContext } from 'react'
import { getConfig } from '../api/client'

interface AdminContextType {
  isAdmin: boolean
  loading: boolean
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
})

export const useAdmin = () => useContext(AdminContext)

export const useAdminProvider = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConfig()
      .then((config) => {
        setIsAdmin(config.adminMode)
      })
      .catch(() => {
        setIsAdmin(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { isAdmin, loading }
}
