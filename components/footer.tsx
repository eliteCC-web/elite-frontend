import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Centro Comercial Elite"
                width={60}
                height={60}
              />
              <span className="font-bold text-xl">Centro Comercial Elite</span>
            </div>
            <p className="text-gray-400 mb-6">
              Tu destino favorito para compras, gastronomía y entretenimiento.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} />
              <SocialLink href="https://youtube.com" icon={<Youtube size={20} />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <FooterLink href="/tiendas">Tiendas</FooterLink>
              <FooterLink href="/eventos">Eventos</FooterLink>
              <FooterLink href="/nosotros">Quiénes Somos</FooterLink>
              <FooterLink href="/chatbot">Chatbot</FooterLink>
              <FooterLink href="/mapa">Mapa del Centro Comercial</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-500 shrink-0 mt-1" size={20} />
                <span className="text-gray-400">Av. Principal #123, Ciudad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-green-500" size={20} />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500" size={20} />
                <span className="text-gray-400">info@ccelite.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Horarios</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-400">Lunes - Viernes</span>
                <span className="text-white">10:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sábados</span>
                <span className="text-white">10:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Domingos</span>
                <span className="text-white">11:00 - 20:00</span>
              </li>
              <li className="flex justify-between mt-4">
                <span className="text-gray-400">Restaurantes</span>
                <span className="text-white">10:00 - 23:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Centro Comercial Elite. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
