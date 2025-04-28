import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ChevronRight, Filter, Search } from 'lucide-react'
import assets from "@/public/assets"

// Datos de muestra para los eventos
const eventosData = [
  {
    id: 1,
    nombre: "Fiesta Colores",
    descripcion: "Celebra con actividades especiales para los más pequeños. Tendremos juegos, payasos, pintacaritas y muchas sorpresas para que los niños disfruten de un día inolvidable.",
    fechaCorta: "26 Abr",
    fecha: "26 de Abril, 2025",
    hora: "10:30 AM",
    lugar: "Séptimo Piso",
    imagen: `${assets.dia_nino_1}`,
    costo: "$20.000",
    slug: "fiesta-colores",
    destacado: true,
    categorias: ["Familiar", "Infantil"]
  },
  {
    id: 2,
    nombre: "Festival Gastronómico",
    descripcion: "Degusta los mejores platillos de nuestros restaurantes. Un recorrido por la gastronomía local e internacional con los mejores chefs de la ciudad.",
    fechaCorta: "15 Ago",
    fecha: "15 de Agosto, 2024",
    hora: "12:00 PM - 9:00 PM",
    lugar: "Zona de Restaurantes",
    imagen: `${assets.plazoleta_2}`,
    costo: "$25.000",
    slug: "festival-gastronomico",
    destacado: true,
    categorias: ["Gastronomía", "Cultural"]
  },
  {
    id: 3,
    nombre: "Desfile de Moda",
    descripcion: "Conoce las últimas tendencias de la temporada. Las mejores marcas presentarán sus colecciones de otoño-invierno en un espectacular desfile.",
    fechaCorta: "10 Sep",
    fecha: "10 de Septiembre, 2024",
    hora: "7:00 PM - 9:00 PM",
    lugar: "Pasarela Central",
    imagen: `${assets.moda_1}`,
    costo: "$15.000",
    slug: "desfile-moda",
    destacado: false,
    categorias: ["Moda", "Tendencias"]
  },
  {
    id: 4,
    nombre: "Concierto de Jazz",
    descripcion: "Disfruta de una noche de jazz con los mejores músicos locales. Una experiencia musical única en un ambiente acogedor.",
    fechaCorta: "25 Sep",
    fecha: "25 de Septiembre, 2024",
    hora: "8:00 PM - 11:00 PM",
    lugar: "Terraza Norte",
    imagen: "/images/jazz-concert.jpg",
    costo: "$30.000",
    slug: "concierto-jazz",
    destacado: false,
    categorias: ["Música", "Cultural"]
  },
  {
    id: 5,
    nombre: "Exposición de Arte",
    descripcion: "Admira las obras de artistas locales en nuestra galería temporal. Pinturas, esculturas y fotografías que te sorprenderán.",
    fechaCorta: "5 Oct",
    fecha: "5 de Octubre, 2024",
    hora: "11:00 AM - 8:00 PM",
    lugar: "Galería Elite",
    imagen: `${assets.arte_1}`,
    costo: "$10.000",
    slug: "exposicion-arte",
    destacado: true,
    categorias: ["Arte", "Cultural"]
  },
  {
    id: 6,
    nombre: "Taller de Manualidades",
    descripcion: "Aprende a crear hermosas manualidades con materiales reciclados. Un taller para toda la familia donde podrás desarrollar tu creatividad.",
    fechaCorta: "12 Oct",
    fecha: "12 de Octubre, 2024",
    hora: "3:00 PM - 6:00 PM",
    lugar: "Sala de Eventos",
    imagen: "/images/crafts-workshop.jpg",
    costo: "$20.000",
    slug: "taller-manualidades",
    destacado: false,
    categorias: ["Familiar", "Educativo"]
  }
]

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/100">
          <div className="relative w-full h-full">
            <Image
              src={assets.hero_eventos}
              alt="Eventos Centro Comercial Elite"
              fill
              className="object-cover brightness-50 opacity-40"
              priority
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Eventos y Actividades
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Descubre todas las actividades y eventos que tenemos preparados para ti
          </p>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select className="appearance-none bg-white px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas las categorías</option>
                  <option value="familiar">Familiar</option>
                  <option value="infantil">Infantil</option>
                  <option value="gastronomia">Gastronomía</option>
                  <option value="cultural">Cultural</option>
                  <option value="moda">Moda</option>
                  <option value="musica">Música</option>
                </select>
                <Filter className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
              <div className="relative w-full md:w-auto">
                <select className="appearance-none bg-white px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Ordenar por fecha</option>
                  <option value="reciente">Más reciente</option>
                  <option value="antiguo">Más antiguo</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Destacados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Eventos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosData
              .filter(evento => evento.destacado)
              .map(evento => (
                <div
                  key={evento.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-56">
                    <Image
                      src={evento.imagen || "/placeholder.svg"}
                      alt={evento.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {evento.fechaCorta}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar size={16} />
                        <span className="text-sm">{evento.fecha}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{evento.nombre}</h3>
                      <span className="text-sm font-bold text-green-600">{evento.costo}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{evento.descripcion}</p>
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <MapPin size={16} />
                      <span className="text-sm">{evento.lugar}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {evento.categorias.map((categoria, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {categoria}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/eventos/${evento.slug}`}
                      className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
                    >
                      Ver detalles <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Todos los Eventos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Todos los Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosData.map(evento => (
              <div
                key={evento.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="relative h-48">
                  <Image
                    src={evento.imagen || "/placeholder.svg"}
                    alt={evento.nombre}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {evento.fechaCorta}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{evento.nombre}</h3>
                    <span className="text-sm font-bold text-green-600">{evento.costo}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{evento.descripcion}</p>
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <Calendar size={16} />
                    <span className="text-sm">{evento.fecha}</span>
                  </div>
                  <Link
                    href={`/eventos/${evento.slug}`}
                    className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
                  >
                    Ver detalles <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suscripción a Eventos */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿No quieres perderte ningún evento?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro boletín y recibe información sobre los próximos eventos y actividades
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-4 py-3 rounded-full text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors">
              Suscribirme
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
