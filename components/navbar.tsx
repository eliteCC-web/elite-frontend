// components/navbar.tsx - ACTUALIZACIÓN sin paneles para la mayoría de roles
'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Calendar, Users, MessageCircle, ChevronDown, Home, Settings, Shield, LogOut, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import assets from "@/public/assets";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHomeClick = () => {
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Solo ADMIN tiene panel administrativo
  const getAdminPanelInfo = () => {
    if (!isAuthenticated || !user) return null;

    if (hasRole('ADMIN')) {
      return {
        label: 'Panel Administrador',
        href: '/admin/dashboard',
        icon: <Shield size={16} />,
        color: 'from-red-600 to-red-700'
      };
    }

    return null; // Solo admin tiene panel
  };

  const adminPanelInfo = getAdminPanelInfo();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-16"> {/* Reducido de h-20 a h-16 */}
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={assets.logo_png}
              alt="Centro Comercial Elite"
              width={40} // Reducido de 50
              height={40}
            />
            <span className="font-bold text-lg text-gray-800 hidden sm:inline-block"> {/* Reducido de text-xl */}
              Centro Comercial Elite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/tiendas">
              <ShoppingBag size={16} /> {/* Reducido de 18 */}
              Tiendas
            </NavLink>
            <NavLink href="/eventos">
              <Calendar size={16} />
              Eventos
            </NavLink>
            <NavLink href="/nosotros">
              <Users size={16} />
              Quiénes Somos
            </NavLink>
            <NavLink href="/chatbot">
              <MessageCircle size={16} />
              Chatea con Eli
            </NavLink>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2"> {/* Reducido gap */}
            {isAuthenticated && user ? (
              <>
                {/* Panel de administración SOLO para admin */}
                {adminPanelInfo && (
                  <Link 
                    href={adminPanelInfo.href}
                    className={`bg-gradient-to-r ${adminPanelInfo.color} hover:opacity-90 text-white px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 text-sm`}
                  >
                    {adminPanelInfo.icon}
                    {adminPanelInfo.label}
                  </Link>
                )}

                {/* Dropdown del usuario */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center"> {/* Reducido de h-8 w-8 */}
                      <span className="text-blue-600 font-medium text-xs">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">
                      {user.firstName}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.roles?.map((role) => (
                            <span key={role.id} className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="py-1">
                        {/* Solo admin ve panel */}
                        {adminPanelInfo && (
                          <Link
                            href={adminPanelInfo.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            {adminPanelInfo.icon}
                            {adminPanelInfo.label}
                          </Link>
                        )}
                        
                        <Link
                          href="/perfil"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User size={16} />
                          Mi Perfil
                        </Link>

                        {/* Solo cliente interno ve 'Mi Tienda' */}
                        {hasRole('CLIENTE_INTERNO') && (
                          <Link
                            href="/mi-tienda"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <ShoppingBag size={16} />
                            Mi Tienda
                          </Link>
                        )}
                        
                        {hasRole('ADMIN') && (
                          <Link
                            href="/admin/settings"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Settings size={16} />
                            Configuración
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Botones de Login/Register cuando no está autenticado */
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors px-3 py-1.5 text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/registro" 
                  className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-4 py-1.5 rounded-full font-medium transition-all text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - versión compacta */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 pt-16 px-4 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Botones superiores más compactos */}
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <button 
            onClick={handleHomeClick}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-1"
            aria-label="Volver al inicio"
          >
            <Home size={16} />
            <span className="text-sm">Inicio</span>
          </button>
          <button 
            onClick={toggleMenu}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile Auth Section */}
        {isAuthenticated && user && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {user.roles?.map((role) => (
                <span key={role.id} className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                  {role.name}
                </span>
              ))}
            </div>

            {/* Panel de administración en móvil - SOLO admin */}
            {adminPanelInfo && (
              <Link 
                href={adminPanelInfo.href}
                className={`bg-gradient-to-r ${adminPanelInfo.color} hover:opacity-90 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 justify-center w-full text-sm`}
                onClick={toggleMenu}
              >
                {adminPanelInfo.icon}
                {adminPanelInfo.label}
              </Link>
            )}
          </div>
        )}

        <nav className="flex flex-col gap-2"> {/* Reducido gap */}
          <MobileNavLink href="/tiendas" onClick={toggleMenu}>
            <ShoppingBag size={18} />
            Tiendas
          </MobileNavLink>
          <MobileNavLink href="/eventos" onClick={toggleMenu}>
            <Calendar size={18} />
            Eventos
          </MobileNavLink>
          <MobileNavLink href="/nosotros" onClick={toggleMenu}>
            <Users size={18} />
            Quiénes Somos
          </MobileNavLink>
          <MobileNavLink href="/chatbot" onClick={toggleMenu}>
            <MessageCircle size={18} />
            Chatbot
          </MobileNavLink>

          {/* Sección de autenticación móvil */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <MobileNavLink href="/perfil" onClick={toggleMenu}>
                  <User size={18} />
                  Mi Perfil
                </MobileNavLink>

                {/* Solo cliente interno ve Mi Tienda */}
                {hasRole('CLIENTE_INTERNO') && (
                  <MobileNavLink href="/mi-tienda" onClick={toggleMenu}>
                    <ShoppingBag size={18} />
                    Mi Tienda
                  </MobileNavLink>
                )}
                
                {hasRole('ADMIN') && (
                  <MobileNavLink href="/admin/settings" onClick={toggleMenu}>
                    <Settings size={18} />
                    Configuración
                  </MobileNavLink>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-red-600 hover:text-red-700 text-base font-medium border-b border-gray-100 w-full"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/login" 
                  className="block w-full py-2.5 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors text-sm"
                  onClick={toggleMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/registro" 
                  className="block w-full py-2.5 px-4 text-center bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all text-sm"
                  onClick={toggleMenu}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay para cerrar dropdown en desktop */}
      {userDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </header>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-red-600 font-medium rounded-md transition-colors text-sm",
        className
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 py-3 text-gray-800 hover:text-red-600 text-base font-medium border-b border-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}