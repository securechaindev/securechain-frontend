'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/use-auth'

export function AuthenticatedComponent() {
  const { makeAuthenticatedRequest, checkAuth, checkTokenExpiry, logout } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, tokenValid: false })

  useEffect(() => {
    const checkInitialAuth = async () => {
      const status = await checkAuth()
      setAuthStatus(status)
    }
    
    checkInitialAuth()
  }, [checkAuth])

  const fetchProtectedData = async () => {
    setLoading(true)
    try {
      const response = await makeAuthenticatedRequest('/api/depex/repositories/user123')
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        console.error('Error fetching data:', response.status)
      }
    } catch (error) {
      console.error('Request failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkTokenStatus = async () => {
    const expired = await checkTokenExpiry()
    alert(expired ? 'Token ha expirado' : 'Token es válido')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-100 p-3 rounded">
        <h3 className="font-bold">Estado de Autenticación:</h3>
        <p>Autenticado: {authStatus.isAuthenticated ? 'Sí' : 'No'}</p>
        <p>Token válido: {authStatus.tokenValid ? 'Sí' : 'No'}</p>
      </div>

      <div className="space-x-2">
        <button 
          onClick={fetchProtectedData} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar datos protegidos'}
        </button>
        
        <button 
          onClick={checkTokenStatus}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Verificar token
        </button>

        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {data && (
        <div className="bg-gray-50 p-3 rounded">
          <h3 className="font-bold mb-2">Datos recibidos:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
