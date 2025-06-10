// app/error.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Icono de error */}
        <div className="bg-red-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-600" />
        </div>

        <h1 className="text-6xl font-bold text-red-600 mb-4">
          Error
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Algo salió mal
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Lo sentimos, ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
        </p>

        {/* Opciones para el usuario */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <RefreshCw size={20} />
            Intentar de nuevo
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Home size={20} />
            Ir al Inicio
          </Link>
        </div>

        {/* Información técnica (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-lg max-w-2xl mx-auto text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Información técnica:</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}