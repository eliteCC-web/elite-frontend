import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, Tag, ChevronLeft, Share2, Heart, Ticket, ChevronRight } from "lucide-react"
import assets from "@/public/assets"
import { notFound } from "next/navigation"

// Datos de muestra para los eventos
const eventosData = [
  {
    id: 1,
    nombre: "Fiesta Colores",
    descripcion:
      "Celebra con actividades especiales para los más pequeños. Tendremos juegos, payasos, pintacaritas y muchas sorpresas para que los niños disfruten de un día inolvidable.",
    descripcionLarga:
      "El Centro Comercial Elite se complace en invitarte a celebrar la Fiesta Colores con una jornada llena de diversión y sorpresas. Hemos preparado un evento especial con múltiples actividades para que los más pequeños de la casa disfruten de un día inolvidable.\n\nContaremos con estaciones de juegos, shows de payasos, áreas de pintacaritas, talleres creativos, inflables, y muchas sorpresas más. También tendremos presentaciones especiales de personajes infantiles favoritos y un espectáculo musical diseñado especialmente para los niños.\n\nNo te pierdas esta oportunidad de crear recuerdos maravillosos en familia. ¡La entrada es gratuita para todos!",
    fechaCorta: "26 Abr",
    fecha: "26 de Abril, 2025",
    hora: "10:30",
    lugar: "Plaza Central",
    imagen: assets.dia_nino_1,
    imagenes: [assets.dia_nino_1, assets.dia_nino_2, assets.dia_nino_3],
    costo: "$20.000",
    slug: "fiesta-colores",
    destacado: true,
    categorias: ["Familiar", "Infantil"],
    organizador: "Centro Comercial Elite",
    capacidad: "25",
    contacto: "eventos@ccelite.com",
  },
  {
    id: 2,
    nombre: "Festival Gastronómico",
    descripcion:
      "Degusta los mejores platillos de nuestros restaurantes. Un recorrido por la gastronomía local e internacional con los mejores chefs de la ciudad.",
    descripcionLarga:
      "El Festival Gastronómico del Centro Comercial Elite es un evento imperdible para los amantes de la buena comida. Durante este día, podrás disfrutar de una experiencia culinaria única, donde nuestros restaurantes presentarán sus mejores creaciones.\n\nRecorre los diferentes stands y descubre una amplia variedad de sabores, desde la cocina tradicional hasta las propuestas más innovadoras. Podrás degustar platillos de la gastronomía local e internacional, preparados por chefs reconocidos.\n\nAdemás, contaremos con demostraciones culinarias en vivo, donde podrás aprender técnicas y secretos de cocina. También habrá maridajes, catas de vino y actividades especiales para los más pequeños.\n\nEl costo de la entrada incluye 5 degustaciones a elegir. Bebidas y degustaciones adicionales tendrán un costo extra.",
    fechaCorta: "15 Ago",
    fecha: "15 de Agosto, 2024",
    hora: "12:00 PM - 9:00 PM",
    lugar: "Zona de Restaurantes",
    imagen: "/images/food-festival.jpg",
    imagenes: ["/images/food-festival.jpg", "/images/food-festival-2.jpg", "/images/food-festival-3.jpg"],
    costo: "$25.000",
    slug: "festival-gastronomico",
    destacado: true,
    categorias: ["Gastronomía", "Cultural"],
    organizador: "Asociación de Restaurantes CC Elite",
    capacidad: "500 personas",
    contacto: "gastronomia@ccelite.com",
  },
  {
    id: 3,
    nombre: "Desfile de Moda",
    descripcion:
      "Conoce las últimas tendencias de la temporada. Las mejores marcas presentarán sus colecciones de otoño-invierno en un espectacular desfile.",
    descripcionLarga:
      "El Centro Comercial Elite te invita a disfrutar de un espectacular Desfile de Moda, donde las mejores marcas presentarán sus colecciones de otoño-invierno. Este evento es una oportunidad única para conocer de primera mano las tendencias que marcarán la próxima temporada.\n\nEn una pasarela especialmente diseñada, modelos profesionales lucirán las creaciones de diseñadores locales e internacionales. Podrás apreciar las últimas propuestas en ropa, calzado y accesorios para hombres y mujeres.\n\nAdemás del desfile, contaremos con un área de exhibición donde podrás ver de cerca las prendas y hablar directamente con representantes de las marcas. También habrá sesiones de asesoría de imagen y maquillaje gratuitas para los asistentes.\n\nAl finalizar el evento, se ofrecerá un cóctel exclusivo y los asistentes recibirán una bolsa de regalo con productos y descuentos especiales de las tiendas participantes.",
    fechaCorta: "10 Sep",
    fecha: "10 de Septiembre, 2024",
    hora: "7:00 PM - 9:00 PM",
    lugar: "Pasarela Central",
    imagen: "/images/fashion-show.jpg",
    imagenes: ["/images/fashion-show.jpg", "/images/fashion-show-2.jpg", "/images/fashion-show-3.jpg"],
    costo: "$15.000",
    slug: "desfile-moda",
    destacado: false,
    categorias: ["Moda", "Tendencias"],
    organizador: "Departamento de Marketing CC Elite",
    capacidad: "200 personas",
    contacto: "moda@ccelite.com",
  },
  {
    id: 4,
    nombre: "Concierto de Jazz",
    descripcion:
      "Disfruta de una noche de jazz con los mejores músicos locales. Una experiencia musical única en un ambiente acogedor.",
    descripcionLarga:
      "El Centro Comercial Elite te invita a una noche especial de jazz en vivo, donde podrás disfrutar de las melodías interpretadas por los mejores músicos locales. Este evento ofrece una experiencia musical única en un ambiente acogedor y elegante.\n\nEl concierto contará con la participación de reconocidos artistas que interpretarán clásicos del jazz y composiciones originales. La velada estará amenizada por un quinteto de jazz compuesto por piano, contrabajo, batería, saxofón y trompeta.\n\nDurante el evento, podrás disfrutar de una selección de bebidas y aperitivos disponibles para compra. La terraza norte del centro comercial se transformará en un club de jazz al aire libre, con iluminación especial y una acústica perfecta para la ocasión.\n\nLas entradas son limitadas para garantizar una experiencia íntima y de calidad. Se recomienda llegar con 30 minutos de anticipación para elegir los mejores lugares.",
    fechaCorta: "25 Sep",
    fecha: "25 de Septiembre, 2024",
    hora: "8:00 PM - 11:00 PM",
    lugar: "Terraza Norte",
    imagen: "/images/jazz-concert.jpg",
    imagenes: ["/images/jazz-concert.jpg", "/images/jazz-concert-2.jpg", "/images/jazz-concert-3.jpg"],
    costo: "$30.000",
    slug: "concierto-jazz",
    destacado: false,
    categorias: ["Música", "Cultural"],
    organizador: "Departamento Cultural CC Elite",
    capacidad: "150 personas",
    contacto: "cultura@ccelite.com",
  },
  {
    id: 5,
    nombre: "Exposición de Arte",
    descripcion:
      "Admira las obras de artistas locales en nuestra galería temporal. Pinturas, esculturas y fotografías que te sorprenderán.",
    descripcionLarga:
      "El Centro Comercial Elite se complace en presentar una extraordinaria Exposición de Arte, donde podrás admirar las obras de talentosos artistas locales en nuestra galería temporal. Esta muestra incluye una variada selección de pinturas, esculturas y fotografías que te sorprenderán por su creatividad y calidad.\n\nLa exposición está organizada en colaboración con el Colectivo de Artistas de la ciudad y presenta obras de más de 20 creadores, desde artistas emergentes hasta nombres reconocidos en la escena cultural local. Las piezas exploran diversos temas y técnicas, ofreciendo una visión amplia del panorama artístico contemporáneo.\n\nDurante la exposición, se realizarán visitas guiadas gratuitas tres veces al día (12:00 PM, 3:00 PM y 6:00 PM), donde un experto en arte explicará las obras y responderá preguntas. También habrá talleres prácticos los fines de semana para quienes deseen experimentar con diferentes técnicas artísticas.\n\nLas obras estarán a la venta y parte de lo recaudado se destinará a programas de educación artística en escuelas públicas de la ciudad.",
    fechaCorta: "5 Oct",
    fecha: "5 de Octubre, 2024",
    hora: "11:00 AM - 8:00 PM",
    lugar: "Galería Elite",
    imagen: "/images/art-exhibition.jpg",
    imagenes: ["/images/art-exhibition.jpg", "/images/art-exhibition-2.jpg", "/images/art-exhibition-3.jpg"],
    costo: "$10.000",
    slug: "exposicion-arte",
    destacado: true,
    categorias: ["Arte", "Cultural"],
    organizador: "Colectivo de Artistas & CC Elite",
    capacidad: "100 personas por hora",
    contacto: "arte@ccelite.com",
  },
  {
    id: 6,
    nombre: "Taller de Manualidades",
    descripcion:
      "Aprende a crear hermosas manualidades con materiales reciclados. Un taller para toda la familia donde podrás desarrollar tu creatividad.",
    descripcionLarga:
      "El Centro Comercial Elite te invita a participar en un divertido Taller de Manualidades, donde aprenderás a crear hermosas piezas utilizando materiales reciclados. Esta actividad está diseñada para toda la familia y es una excelente oportunidad para desarrollar tu creatividad mientras contribuyes al cuidado del medio ambiente.\n\nEl taller será dirigido por la reconocida artesana María González, quien compartirá técnicas y consejos para transformar objetos cotidianos en verdaderas obras de arte. Aprenderás a elaborar decoraciones para el hogar, accesorios personales y juguetes utilizando materiales como papel, cartón, plástico y tela.\n\nTodos los materiales necesarios están incluidos en el costo de inscripción. Cada participante podrá llevarse a casa las creaciones realizadas durante el taller. No se requiere experiencia previa, solo ganas de aprender y divertirse.\n\nEl taller tiene una duración de 3 horas y está limitado a 30 participantes para garantizar una atención personalizada. Se recomienda usar ropa cómoda que pueda mancharse durante el proceso creativo.",
    fechaCorta: "12 Oct",
    fecha: "12 de Octubre, 2024",
    hora: "3:00 PM - 6:00 PM",
    lugar: "Sala de Eventos",
    imagen: "/images/crafts-workshop.jpg",
    imagenes: ["/images/crafts-workshop.jpg", "/images/crafts-workshop-2.jpg", "/images/crafts-workshop-3.jpg"],
    costo: "$20.000",
    slug: "taller-manualidades",
    destacado: false,
    categorias: ["Familiar", "Educativo"],
    organizador: "Departamento de Sostenibilidad CC Elite",
    capacidad: "30 personas",
    contacto: "talleres@ccelite.com",
  },
]

// Función para generar metadatos sin tipado
export async function generateMetadata({ params }) {
    const evento = eventosData.find((e) => e.slug === params.slug)
    
    if (!evento) {
      return {
        title: 'Evento no encontrado',
        description: 'El evento que buscas no existe o ha sido eliminado'
      }
    }
    
    return {
      title: evento.nombre,
      description: evento.descripcion,
    }
  }
  
  // Componente de página sin tipado explícito
  export default function Page({ params }) {
    const evento = eventosData.find((e) => e.slug === params.slug)
  
    if (!evento) {
      notFound()
    }
  
    // Eventos relacionados 
    const eventosRelacionados = eventosData
      .filter((e) => e.slug !== params.slug && e.categorias.some((cat) => evento.categorias.includes(cat)))
      .slice(0, 3)
  
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <Image
                src={evento.imagen || "/placeholder.svg"}
                alt={evento.nombre}
                fill
                className="object-cover brightness-50"
                priority
              />
            </div>
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {evento.categorias.map((categoria, index) => (
                <span key={index} className="text-sm bg-blue-700 text-white px-3 py-1 rounded-full">
                  {categoria}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{evento.nombre}</h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">{evento.descripcion}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <Calendar size={20} />
                <span>{evento.fecha}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Clock size={20} />
                <span>{evento.hora}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin size={20} />
                <span>{evento.lugar}</span>
              </div>
            </div>
          </div>
        </section>
  
        {/* Navegación y Acciones */}
        <section className="sticky top-0 z-30 bg-white shadow-md py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/eventos" className="inline-flex items-center text-gray-700 hover:text-blue-700">
                <ChevronLeft size={20} className="mr-1" />
                Volver a eventos
              </Link>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-700 hover:text-red-600">
                  <Heart size={20} />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700">
                  <Share2 size={20} />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-all">
                  <Ticket size={20} />
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        </section>
  
        {/* Contenido Principal */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Columna Principal */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalles del Evento</h2>
                  <div className="prose max-w-none">
                    {evento.descripcionLarga.split("\n\n").map((parrafo, index) => (
                      <p key={index} className="mb-4 text-gray-700">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                </div>
  
                {/* Galería de Imágenes */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Galería</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {evento.imagenes.map((imagen, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imagen || "/placeholder.svg"}
                          alt={`${evento.nombre} - Imagen ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Ubicación */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Ubicación</h2>
                  <div className="relative h-80 rounded-lg overflow-hidden mb-4">
                    <Image src="/images/map-placeholder.jpg" alt="Mapa de ubicación" fill className="object-cover" />
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin size={24} className="text-blue-700 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">{evento.lugar}</h3>
                      <p className="text-gray-600">Centro Comercial Elite, Av. Principal #123, Ciudad</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Columna Lateral */}
              <div className="lg:w-1/3">
                {/* Información del Evento */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Información</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Calendar size={20} className="text-blue-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">Fecha</h3>
                        <p className="text-gray-600">{evento.fecha}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={20} className="text-blue-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">Horario</h3>
                        <p className="text-gray-600">{evento.hora}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Tag size={20} className="text-blue-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">Costo</h3>
                        <p className="text-gray-600">{evento.costo}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users size={20} className="text-blue-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">Capacidad</h3>
                        <p className="text-gray-600">{evento.capacidad}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin size={20} className="text-blue-700 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">Lugar</h3>
                        <p className="text-gray-600">{evento.lugar}</p>
                      </div>
                    </li>
                  </ul>
                </div>
  
                {/* Organizador */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Organizador</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={24} className="text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{evento.organizador}</h3>
                      <p className="text-gray-600">Organizador del evento</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Para más información sobre este evento, puedes contactar directamente al organizador.
                  </p>
                  <div className="text-blue-700 font-medium">{evento.contacto}</div>
                </div>
  
                {/* Botón de Inscripción */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all">
                    <Ticket size={20} />
                    Inscribirse al Evento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Eventos Relacionados */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Eventos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventosRelacionados.map((eventoRel) => (
                <div
                  key={eventoRel.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="relative h-48">
                    <Image
                      src={eventoRel.imagen || "/placeholder.svg"}
                      alt={eventoRel.nombre}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {eventoRel.fechaCorta}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{eventoRel.nombre}</h3>
                      <span className="text-sm font-bold text-green-600">{eventoRel.costo}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{eventoRel.descripcion}</p>
                    <Link
                      href={`/eventos/${eventoRel.slug}`}
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
      </main>
    )
  }
  