/* eslint-disable */
// app/unauthorized/page.tsx
"use client";
import Image from "next/image"
import Link from "next/link"
import { Home, Shield, ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function UnauthorizedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 text-center">
          {/* Número 403 */}
          <h1 className="text-9xl font-bold text-red-600 mb-6">
            403
          </h1>

          {/* Mensaje principal */}
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-red-600" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Acceso Denegado
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            No tienes los permisos necesarios para acceder a esta página. Si crees que esto es un error, 
            contacta al administrador del sistema.
          </p>

          {/* Opciones para el usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <Link href="/" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Home size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ir al Inicio</h3>
              <p className="text-gray-600">Vuelve a la página principal del centro comercial</p>
            </Link>

            <button 
              onClick={() => window.history.back()}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ArrowLeft size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Página Anterior</h3>
              <p className="text-gray-600">Regresa a la página desde donde viniste</p>
            </button>
          </div>

          {/* Información de contacto */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas acceso a esta sección?</h3>
            <p className="mb-6">
              Si requieres permisos especiales para acceder a esta área, contacta al administrador del sistema.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors"
            >
              Contactar Administrador
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}