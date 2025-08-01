// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando...</h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    )
  }