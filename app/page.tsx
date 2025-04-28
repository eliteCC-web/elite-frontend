import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ShoppingBag, Calendar, MapPin, MessageCircle } from "lucide-react"
import assets from "@/public/assets"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/100"> {/* Fondo negro semitransparente */}
          <div className="relative w-full h-full">
            <Image
              src={assets.plazoleta_1}
              alt="Centro Comercial Elite"
              fill
              className="object-cover brightness-50 opacity-40"
              priority
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src={assets.logo_png}
              alt="Logo Centro Comercial Elite"
              width={150}
              height={150}
              //className="animate-pulse"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Centro Comercial Elite
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Tu destino favorito para compras, gastronomía y entretenimiento
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tiendas"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all"
            >
              Explorar Tiendas <ChevronRight size={20} />
            </Link>
            <Link
              href="/eventos"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all"
            >
              Ver Eventos <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tiendas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Nuestras Tiendas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre una amplia variedad de tiendas y restaurantes para todos los gustos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link
                    href={`/tiendas/${category.slug}`}
                    className="inline-flex items-center text-red-600 font-medium hover:text-red-700"
                  >
                    Ver tiendas <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tiendas"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-red-700 hover:to-purple-700 transition-all"
            >
              <ShoppingBag size={20} />
              Ver todas las tiendas
            </Link>
          </div>
        </div>
      </section>

      {/* Eventos Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Próximos Eventos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No te pierdas nuestras actividades y celebraciones especiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-blue-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {event.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.name}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link
                    href={`/eventos/${event.slug}`}
                    className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
                  >
                    Más información <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-green-500 text-white px-8 py-3 rounded-full font-medium hover:from-blue-800 hover:to-green-600 transition-all"
            >
              <Calendar size={20} />
              Ver todos los eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={assets.hero_img}
                  alt="Centro Comercial Elite Exterior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Quiénes Somos</h2>
              <p className="text-lg text-gray-600 mb-6">
                Centro Comercial Elite es el destino preferido para compras, gastronomía y entretenimiento. Ofrecemos
                una experiencia única con más de 100 tiendas, restaurantes de primera categoría y espacios de
                entretenimiento para toda la familia.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Nuestra misión es brindar la mejor experiencia de compra y entretenimiento, en un ambiente seguro,
                cómodo y moderno para todos nuestros visitantes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-yellow-400 p-3 rounded-full">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Ubicación</h4>
                    <p>Av. Principal #123, Ciudad</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-green-500 p-3 rounded-full text-white">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Contáctanos</h4>
                    <p>info@ccelite.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Promo Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Tienes preguntas? Chatea con nuestro asistente virtual</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestro chatbot con IA está disponible 24/7 para responder todas tus consultas sobre tiendas, eventos,
            horarios y más.
          </p>
          <button className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-3 rounded-full font-medium inline-flex items-center gap-2">
            <MessageCircle size={20} />
            Iniciar chat
          </button>
        </div>
      </section>
    </main>
  )
}

// Datos de muestra
const storeCategories = [
  {
    name: "Moda y Accesorios",
    description: "Las mejores marcas nacionales e internacionales",
    image: `${assets.moda_2}`,
    slug: "moda",
  },
  {
    name: "Restaurantes",
    description: "Gastronomía local e internacional para todos los gustos",
    image: `${assets.plazoleta_3}`,
    slug: "restaurantes",
  },
  {
    name: "Entretenimiento",
    description: "Cines, juegos y diversión para toda la familia",
    image: `${assets.entretenimiento_1}`,
    slug: "entretenimiento",
  },
]

const events = [
  {
    name: "Fiesta Colores",
    description: "Celebra con actividades especiales para los más pequeños. Tendremos juegos, payasos, pintacaritas y muchas sorpresas para que los niños disfruten de un día inolvidable.",
    date: "26 Abr",
    image: `${assets.dia_nino_1}`,
    slug: "fiesta-colores",
  },
  {
    name: "Festival Gastronómico",
    description: "Degusta los mejores platillos de nuestros restaurantes",
    date: "15 Ago",
    image: `${assets.plazoleta_2}`,
    slug: "festival-gastronomico",
  },
  {
    name: "Desfile de Moda",
    description: "Conoce las últimas tendencias de la temporada",
    date: "10 Sep",
    image: `${assets.moda_1}`,
    slug: "desfile-moda",
  },
]
