/* eslint-disable */
import Image from "next/image"
import Link from "next/link"
import { Home, Construction, Map, ArrowRight, Calendar } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function NotFound() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">

        {/* Número 404 */}
        <h1 className="text-9xl font-bold text-gray-700 mb-6">
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          ¡Ups! Esta área aún no existe
        </h2>

        {/* Submensaje */}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Parece que has llegado a una sección que aún está en planos o quizás ni siquiera está en nuestros proyectos
          futuros.
        </p>

        {/* Opciones para el usuario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Link href="/" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Home size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Volver al inicio</h3>
            <p className="text-gray-600">Regresa a la entrada principal del centro comercial</p>
          </Link>

          <Link href="/eventos" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ver eventos</h3>
            <p className="text-gray-600">Descubre las actividades que tenemos preparadas</p>
          </Link>

          <Link href="/mapa" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Map size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Consultar mapa</h3>
            <p className="text-gray-600">Encuentra tu ubicación en el centro comercial</p>
          </Link>
        </div>

        {/* Mensaje final */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white p-8 rounded-xl max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">¿Tienes una idea para este espacio?</h3>
          <p className="mb-6">
            Nos encantaría escuchar tus sugerencias sobre qué te gustaría ver en el Centro Comercial Elite.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Enviar sugerencia <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
      <Footer />
    </main>
    </>
  )
}
