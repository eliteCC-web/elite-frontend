/* eslint-disable */
// components/admin/admin-layout.tsx - ACTUALIZACIÓN
'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, Store, Calendar, Users, Bell, Settings, LogOut, 
  Menu, X, ChevronDown, Search, Home, Shield, FileText, Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import RoleGuard from '@/components/RoleGuard';
import ProtectedRoute from '@/components/ProtectedRoute';
import assets from '@/public/assets';
import Navbar from '../navbar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Definir elementos de navegación con roles
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: <LayoutDashboard size={20} />,
      active: pathname === '/admin/dashboard',
      roles: ['ADMIN', 'COLABORADOR']
    },
    { 
      name: 'Tiendas', 
      href: '/admin/stores', 
      icon: <Store size={20} />,
      active: pathname.startsWith('/admin/stores'),
      roles: ['ADMIN', 'COLABORADOR']
    },
    { 
      name: 'Eventos', 
      href: '/admin/events', 
      icon: <Calendar size={20} />,
      active: pathname.startsWith('/admin/events'),
      roles: ['ADMIN', 'COLABORADOR']
    },
    { 
      name: 'Turnos', 
      href: '/admin/schedules', 
      icon: <Clock size={20} />,
      active: pathname.startsWith('/admin/schedules'),
      roles: ['ADMIN']
    },
    { 
      name: 'Usuarios', 
      href: '/admin/users', 
      icon: <Users size={20} />,
      active: pathname.startsWith('/admin/users'),
      roles: ['ADMIN']
    },
    { 
      name: 'Registros Pendientes', 
      href: '/admin/pending-registrations', 
      icon: <Bell size={20} />,
      active: pathname.startsWith('/admin/pending-registrations'),
      roles: ['ADMIN']
    },
    { 
      name: 'Roles y Permisos', 
      href: '/admin/roles', 
      icon: <Shield size={20} />,
      active: pathname.startsWith('/admin/roles'),
      roles: ['ADMIN']
    },
    { 
      name: 'Documentos', 
      href: '/admin/documents', 
      icon: <FileText size={20} />,
      active: pathname.startsWith('/admin/documents'),
      roles: ['ADMIN', 'COLABORADOR', 'CLIENTE_INTERNO']
    }
  ];

  // Filtrar elementos de navegación según roles del usuario
  const visibleNavItems = navItems.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'COLABORADOR']}>
      <Navbar/>
      <div className="main-layout">
        {/* Sidebar para pantallas grandes */}
        <aside 
          className={cn(
            "sidebar",
            sidebarOpen ? "sidebar-open" : "sidebar-mobile"
          )}
        >
          {/* Mobile close button */}
          <div className="mobile-only absolute right-4 top-4">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-neutral-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Image
                src={assets.logo_png}
                alt="Centro Comercial Elite"
                width={36}
                height={36}
              />
              <span className="font-semibold text-neutral-800">Elite Admin</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.roles?.map(role => role.name).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-4 py-6 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {visibleNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={cn(
                      "nav-link",
                      item.active && "nav-link-active"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Información adicional según rol */}
            <div className="mt-8 pt-4 border-t border-neutral-200">
              <div className="px-4">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Acceso Rápido
                </h4>
                <div className="space-y-1">
                  <RoleGuard roles={['ADMIN']}>
                    <Link
                      href="/admin/settings"
                      className="nav-link"
                    >
                      <Settings size={16} />
                      Configuración
                    </Link>
                  </RoleGuard>
                  
                  <RoleGuard roles={['ADMIN', 'COLABORADOR']}>
                    <Link
                      href="/admin/reports"
                      className="nav-link"
                    >
                      <FileText size={16} />
                      Reportes
                    </Link>
                  </RoleGuard>

                  <RoleGuard roles={['COLABORADOR']}>
                    <Link
                      href="/mi-horario"
                      className="nav-link"
                    >
                      <Clock size={16} />
                      Mi Horario
                    </Link>
                  </RoleGuard>
                </div>
              </div>
            </div>
          </nav>

          {/* Botones inferiores */}
          <div className="p-4 border-t border-neutral-200">
            <div className="space-y-2">
              <Link
                href="/"
                className="nav-link"
              >
                <Home size={20} />
                <span className="font-medium">Ir al sitio</span>
              </Link>
              <button
                onClick={handleLogout}
                className="nav-link text-secondary-500 hover:text-secondary-600 hover:bg-secondary-50 w-full"
              >
                <LogOut size={20} />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="content-layout">
          {/* Header móvil */}
          <div className="mobile-only bg-white border-b border-neutral-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-neutral-500" />
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src={assets.logo_png}
                  alt="Centro Comercial Elite"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-neutral-800">Elite</span>
              </Link>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Bell size={20} className="text-neutral-500" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <ChevronDown size={16} className="text-neutral-500" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="dropdown">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/admin/settings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          Configuración
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="dropdown-item text-secondary-500 hover:bg-secondary-50 w-full"
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de la página */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}