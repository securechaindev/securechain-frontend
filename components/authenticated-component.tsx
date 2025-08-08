'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { useAuthContext } from './auth-provider'

export function AuthenticatedComponent() {
  const { makeAuthenticatedRequest, checkTokenExpiry, logout } = useAuth()
  const { isAuthenticated, isLoading } = useAuthContext()
  const [data, setData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

  const fetchProtectedData = async () => {
    setDataLoading(true)
    try {
      const response = await makeAuthenticatedRequest('/api/depex/repositories/user123')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching protected data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const checkTokenStatus = async () => {
    const expired = await checkTokenExpiry()
    alert(expired ? 'Token ha expirado' : 'Token es válido')
  }

  const handleLogout = () => {
    logout()
  }

  if (isLoading) {
    return <div className="p-4">Verificando autenticación...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-100 p-3 rounded">
        <h3 className="font-bold">Estado de Autenticación:</h3>
        <p>Autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
        <p className="text-sm text-gray-600 mt-2">
          * Los tokens se verifican y renuevan automáticamente en cada llamada API
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={fetchProtectedData}
          disabled={dataLoading || !isAuthenticated}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {dataLoading ? 'Cargando...' : 'Cargar datos protegidos'}
        </button>

        <button
          onClick={checkTokenStatus}
          disabled={!isAuthenticated}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Verificar token
        </button>

        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
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
