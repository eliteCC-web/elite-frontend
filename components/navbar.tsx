/* eslint-disable */

// components/navbar.tsx - ACTUALIZACIÓN con barra móvil mejorada
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Calendar, User, LogOut, Shield, Users, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import assets from '@/public/assets';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated, hasRole, logout } = useAuth();
  const pathname = usePathname();

  // Detectar si estamos en la página home
  const isHomePage = pathname === '/';

  // Detectar scroll para cambiar el navbar
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          // En la home page, el navbar se comporta como antes
          if (isHomePage) {
            const shouldBeScrolled = currentScrollY > 50;
          setIsScrolled(shouldBeScrolled);
          } else {
            // En otras páginas, el navbar siempre está visible con fondo
            setIsScrolled(true);
            
            // Solo ocultar/mostrar basado en dirección del scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling down - hide navbar
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
              // Scrolling up - show navbar
              setIsVisible(true);
            }
            
            // Si estamos en el top, siempre mostrar
            if (currentScrollY <= 100) {
              setIsVisible(true);
            }
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, lastScrollY]);

  // Cerrar menú móvil al hacer scroll
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isScrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out",
        isHomePage 
          ? (isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
            )
          : (isVisible 
              ? "bg-white/95 backdrop-blur-md shadow-lg transform translate-y-0" 
              : "bg-white/95 backdrop-blur-md shadow-lg transform -translate-y-full"
            )
      )}>
        <div className="container-modern">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo - siempre visible */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
                  isScrolled 
                    ? "bg-white rounded-2xl" 
                    : "bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
                )}>
                  <Image
                    src={assets.logo_png}
                    alt="Elite"
                    width={32}
                    height={32}
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
              <div className={cn(
                "hidden sm:block transition-all duration-500 ease-in-out",
                isHomePage 
                  ? (isScrolled ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-4")
                  : "opacity-100 transform translate-x-0"
              )}>
                <span className="text-display text-xl text-neutral-900 font-bold">
                  elite
                </span>
                <span className="block text-xs text-neutral-500 font-medium">
                  Centro Comercial
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={cn(
              "hidden lg:flex items-center gap-8 transition-all duration-500 ease-in-out",
              isHomePage 
                ? (isScrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none")
                : "opacity-100 transform translate-y-0"
            )}>
              <NavLink href="/tiendas">
                <ShoppingBag size={18} />
                Tiendas
              </NavLink>
              <NavLink href="/eventos">
                <Calendar size={18} />
                Eventos
              </NavLink>
              <NavLink href="/nosotros">
                <Users size={18} />
                Nosotros
              </NavLink>
              {/*
              <NavLink href="/chatbot">
                <MessageCircle size={18} />
                Eli Chat
              </NavLink>
              */}
            </nav>

            {/* Desktop Auth Section */}
            <div className={cn(
              "hidden lg:flex items-center gap-4 transition-all duration-500 ease-in-out",
              isHomePage 
                ? (isScrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none")
                : "opacity-100 transform translate-y-0"
            )}>
              {isAuthenticated && user ? (
                <>
                  {hasRole('ADMIN') && (
                    <Link 
                      href="/admin/dashboard"
                      className="bg-transparentborder-2 border-secondary-500 btn-sm rounded-2xl flex items-center gap-2 hover:shadow-lg transition-all duration-200 relative"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(to bottom right, #002d5a, #c8181c) border-box',
                        border: '2px solid transparent'
                      }}
                    >
                      <Shield size={16} style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(to bottom right, #002d5a, #c8181c) border-box',
                      }} />
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-secondary-500 to-primary-500 font-bold">Admin</span>
                    </Link>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-100 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-200">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-neutral-700">
                        {user?.firstName || 'Usuario'}
                      </span>
                      <ChevronDown size={16} className="text-neutral-500 group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-strong border border-neutral-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200 max-w-[calc(100vw-2rem)]">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/perfil"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl mx-2"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User size={16} />
                            Mi Perfil
                          </Link>
                          
                          {hasRole('ADMIN') && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl mx-2"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <Shield size={16} />
                              Panel Admin
                            </Link>
                          )}
                          
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-2 w-full"
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
                <div className="flex items-center gap-3">
                  <Link href="/login" className="btn-outline btn-sm rounded-2xl">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="btn-primary btn-sm rounded-2xl">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className={cn(
                "lg:hidden p-3 rounded-2xl transition-all duration-300 hover:scale-105",
                isScrolled 
                  ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100" 
                  : "text-white hover:bg-white/20 backdrop-blur-sm"
              )}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-neutral-200 transform transition-transform duration-300 ease-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Image
                    src={assets.logo_png}
                    alt="Elite"
                    width={24}
                    height={24}
                    className="drop-shadow-sm"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-neutral-900">elite</span>
                  <span className="block text-xs text-neutral-500">Centro Comercial</span>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <X size={24} className="text-neutral-600" />
              </button>
            </div>

            {/* Navigation */}
            <div className="p-6">
              <nav className="space-y-1 mb-8">
                <MobileNavLink href="/tiendas" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingBag size={20} />
                  Tiendas
                </MobileNavLink>
                <MobileNavLink href="/eventos" onClick={() => setIsMenuOpen(false)}>
                  <Calendar size={20} />
                  Eventos
                </MobileNavLink>
                <MobileNavLink href="/nosotros" onClick={() => setIsMenuOpen(false)}>
                  <Users size={20} />
                  Nosotros
                </MobileNavLink>
                {/*
                <MobileNavLink href="/chatbot" onClick={() => setIsMenuOpen(false)}>
                  <MessageCircle size={20} />
                  Eli Chat
                </MobileNavLink>
                */}
              </nav>
              
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-neutral-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Actions */}
                  <div className="space-y-2">
                    <MobileNavLink href="/perfil" onClick={() => setIsMenuOpen(false)}>
                      <User size={20} />
                      Mi Perfil
                    </MobileNavLink>
                    
                    {hasRole('ADMIN') && (
                      <MobileNavLink href="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Shield size={20} />
                        Panel Admin
                      </MobileNavLink>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
                    >
                      <LogOut size={20} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    href="/login" 
                    className="btn-outline w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'nav-link flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 hover:bg-neutral-100 hover:scale-105',
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
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-xl font-medium"
    >
      {children}
    </Link>
  );
}