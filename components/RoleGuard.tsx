// components/RoleGuard.tsx - Componente para mostrar contenido basado en roles
'use client';

import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // Si se requieren todos los roles/permisos o solo uno
}

export default function RoleGuard({ 
  children, 
  roles = [], 
  permissions = [],
  fallback = null,
  requireAll = false
}: RoleGuardProps) {
  const { hasRole, hasPermission } = useAuth();

  // Verificar roles
  if (roles.length > 0) {
    const roleCheck = requireAll 
      ? roles.every(role => hasRole(role))
      : roles.some(role => hasRole(role));
    
    if (!roleCheck) {
      return <>{fallback}</>;
    }
  }

  // Verificar permisos
  if (permissions.length > 0) {
    const permissionCheck = requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));
    
    if (!permissionCheck) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}