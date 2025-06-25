# Guía del Sistema de Registro Interno

## 📋 Descripción General

El sistema de registro interno permite a colaboradores y clientes internos solicitar acceso al sistema de Elite Centro Comercial. Todas las solicitudes requieren aprobación de un administrador antes de que el usuario pueda acceder.

## 🔗 URLs del Sistema

### Registro Interno (Oculto)
- **URL**: `/register-internal`
- **Acceso**: Solo escribiendo la URL directamente
- **No hay enlaces públicos** que lleven a esta página
- **Propósito**: Registro de colaboradores y clientes internos

### Panel de Aprobación (Admin)
- **URL**: `/admin/pending-registrations`
- **Acceso**: Solo administradores
- **Propósito**: Revisar y aprobar/rechazar solicitudes

## 👥 Tipos de Registro

### 1. Colaborador
- **Rol**: `COLABORADOR`
- **Campos requeridos**:
  - Nombre y apellido
  - Email
  - Teléfono
  - Contraseña
- **Acceso**: Sistema de turnos, reportes, etc.

### 2. Cliente Interno (Local)
- **Rol**: `CLIENTE_INTERNO`
- **Campos requeridos**:
  - Información personal (nombre, email, teléfono, contraseña)
  - Información del local:
    - Nombre del local
    - Descripción
    - Dirección
    - Teléfono del local
  - **Hasta 10 imágenes** del local
- **Acceso**: Gestión de su local, reportes, etc.

## 🖼️ Sistema de Imágenes

### Configuración de Supabase
El sistema usa Supabase Storage para las imágenes. Configuración necesaria:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Bucket de Storage
- **Nombre**: `elitecc-web`
- **Carpeta**: `store-images/`
- **Límites**:
  - Máximo 10 imágenes por local
  - Máximo 5MB por imagen
  - Formatos: JPG, PNG, GIF, WebP

### Funcionalidades
- **Subida múltiple**: Seleccionar varias imágenes a la vez
- **Vista previa**: Ver imágenes antes de enviar
- **Eliminación**: Remover imágenes individuales
- **Validación**: Tamaño y formato automático

## 🔄 Flujo de Aprobación

### 1. Solicitud de Registro
1. Usuario accede a `/register-internal`
2. Completa el formulario con su información
3. Si es cliente interno, sube imágenes del local
4. Envía la solicitud

### 2. Estado Pendiente
- La solicitud queda en estado `PENDING`
- El usuario no puede acceder al sistema aún
- Se envía notificación al administrador

### 3. Revisión del Administrador
1. Admin accede a `/admin/pending-registrations`
2. Ve lista de solicitudes pendientes
3. Puede ver detalles completos de cada solicitud
4. Acepta o rechaza la solicitud

### 4. Resultado
- **Aprobado**: Usuario recibe notificación y puede acceder
- **Rechazado**: Usuario recibe notificación con motivo

## 🛠️ Configuración del Backend

### Endpoints Necesarios

#### 1. Registro Interno
```
POST /api/auth/register-internal
```

**Body**:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "phone": "string",
  "roleType": "COLABORADOR" | "CLIENTE_INTERNO",
  "store": {
    "name": "string",
    "description": "string",
    "address": "string",
    "phone": "string",
    "schedule": [
      {
        "day": "monday|tuesday|wednesday|thursday|friday|saturday|sunday",
        "openTime": "HH:MM",
        "closeTime": "HH:MM",
        "isOpen": boolean
      }
    ],
    "images": ["string[]"]
  }
}
```

#### 2. Obtener Registros Pendientes
```
GET /api/admin/pending-registrations
```

#### 3. Aprobar Registro
```
POST /api/admin/pending-registrations/{id}/approve
```

#### 4. Rechazar Registro
```
POST /api/admin/pending-registrations/{id}/reject
```

### Base de Datos

#### Tabla: `pending_registrations`
```sql
CREATE TABLE pending_registrations (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role_type VARCHAR(50) NOT NULL,
  store_name VARCHAR(255),
  store_description TEXT,
  store_address TEXT,
  store_phone VARCHAR(20),
  store_schedule JSONB, -- Horarios de atención
  store_images TEXT[], -- Array de URLs
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Seguridad

### Medidas Implementadas
1. **URL oculta**: No hay enlaces públicos al registro interno
2. **Validación de roles**: Solo admins pueden aprobar
3. **Validación de datos**: Todos los campos son validados
4. **Límites de archivos**: Tamaño y cantidad de imágenes limitados
5. **Autenticación**: Token JWT requerido para operaciones admin

### Recomendaciones
1. **Monitoreo**: Revisar logs de registros sospechosos
2. **Backup**: Respaldo regular de la base de datos
3. **Rate Limiting**: Implementar límites de solicitudes
4. **Notificaciones**: Email automático al admin cuando hay nuevas solicitudes

## 📧 Notificaciones

### Email Automático
- **Nueva solicitud**: Notificar al admin
- **Aprobación**: Notificar al usuario
- **Rechazo**: Notificar al usuario con motivo

### Plantillas Sugeridas
```html
<!-- Nueva Solicitud -->
<h2>Nueva solicitud de registro interno</h2>
<p>Se ha recibido una nueva solicitud de: {nombre} {apellido}</p>
<p>Tipo: {tipo}</p>
<p>Revisa en: /admin/pending-registrations</p>

<!-- Aprobación -->
<h2>Solicitud aprobada</h2>
<p>Tu solicitud de registro ha sido aprobada.</p>
<p>Ya puedes acceder al sistema con tu email y contraseña.</p>

<!-- Rechazo -->
<h2>Solicitud rechazada</h2>
<p>Tu solicitud de registro ha sido rechazada.</p>
<p>Motivo: {motivo}</p>
```

## 🚀 Despliegue

### Variables de Entorno Requeridas
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=postgresql://postgres:[PASSWORD]@db.pmulriauzstmyeslfvpn.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Configuración de Supabase
1. Crear bucket `elite-store-images`
2. Configurar políticas de acceso
3. Habilitar RLS (Row Level Security)
4. Configurar políticas para subida de archivos

#### Política para INSERT (subir archivos):
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'elitecc-web' AND 
  auth.role() = 'authenticated'
);
```

#### Política para SELECT (ver archivos):
```sql
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (
  bucket_id = 'elitecc-web'
);
```

## 📝 Notas de Desarrollo

- El sistema está diseñado para ser "oculto" pero funcional
- Las imágenes se almacenan en Supabase Storage
- Todos los registros requieren aprobación manual
- El sistema es escalable para futuras funcionalidades
- Se puede extender para otros tipos de usuarios internos 

## Características

- **Registro diferenciado**: Colaboradores vs Clientes Internos
- **Información del local**: Nombre, descripción, dirección, teléfono
- **Horarios de atención**: Configuración por día de la semana con horarios de apertura y cierre
- **Subida de imágenes**: Hasta 10 imágenes del local (solo se suben al enviar el formulario)
- **Verificación de email**: Se envía un email de verificación al registrarse
- **Sistema de aprobación**: Los administradores pueden aprobar/rechazar solicitudes
- **Notificaciones**: Los usuarios son notificados cuando su solicitud es procesada
- **Validación**: Validación completa del formulario antes del envío

## Configuración de Base de Datos

### 1. Ejecutar migración SQL

Ejecuta el siguiente script SQL en tu base de datos PostgreSQL:

```sql
-- Agregar campos para registro interno a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS store_info JSONB;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role_type ON users USING GIN((store_info->>'roleType'));

-- Insertar roles si no existen
INSERT INTO roles (name, description) 
VALUES 
  ('COLABORADOR', 'Colaborador interno del centro comercial'),
  ('CLIENTE_INTERNO', 'Cliente interno con local en el centro comercial')
ON CONFLICT (name) DO NOTHING;
```

### 2. Verificar configuración

Asegúrate de que los roles `COLABORADOR` y `CLIENTE_INTERNO` existan en tu tabla `roles`.

## Configuración de Supabase 

## Flujo de Registro Interno

### 1. Registro del Usuario
1. El usuario completa el formulario de registro interno
2. Se valida toda la información del formulario
3. Se suben las imágenes a Supabase (solo si hay archivos seleccionados)
4. Se crea el usuario con estado `PENDING`
5. Se envía un email de verificación al usuario

### 2. Verificación de Email
1. El usuario recibe un email con un enlace de verificación
2. Al hacer clic en el enlace, se marca el email como verificado
3. El usuario puede iniciar sesión, pero su cuenta sigue pendiente de aprobación

### 3. Aprobación por Administrador
1. Un administrador revisa la solicitud en el panel de administración
2. Puede aprobar o rechazar la solicitud
3. El usuario recibe una notificación del resultado

### 4. Acceso Completo
1. Una vez aprobado, el usuario tiene acceso completo al sistema
2. Si es CLIENTE_INTERNO, puede gestionar su local y horarios

## Configuración de Base de Datos 