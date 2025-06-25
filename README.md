# Elite Frontend

Este es un proyecto [Next.js](https://nextjs.org) para el frontend de Elite Centro Comercial.

## 🚀 Comandos de Desarrollo

### Comandos Básicos
```bash
# Desarrollo normal
npm run dev

# Desarrollo con limpieza de caché automática
npm run dev:clean

# Construcción normal
npm run build

# Construcción con limpieza de caché automática
npm run build:clean

# Iniciar servidor de producción
npm run start

# Linting
npm run lint
```

### Comandos de Limpieza
```bash
# Limpiar caché básica
npm run clean

# Limpieza completa (incluye reinstalación de dependencias)
npm run clean:all
```

### Scripts de Windows
Si estás en Windows y tienes problemas de caché, puedes usar:

```powershell
# PowerShell
.\clean-cache.ps1

# O Batch
clean-cache.bat
```

## 🔧 Solución de Problemas

### Problema: Error de compilación o caché corrupta
Si encuentras errores de compilación o problemas con la caché:

1. **Solución rápida**: Usa `npm run dev:clean`
2. **Limpieza manual**: Ejecuta `npm run clean`
3. **Limpieza completa**: Ejecuta `npm run clean:all`

### Problema: Cambios no se reflejan
Si los cambios en el código no se reflejan en el navegador:

1. Detén el servidor (Ctrl+C)
2. Ejecuta `npm run clean`
3. Reinicia con `npm run dev`

## 📁 Estructura del Proyecto

```
elite-frontend/
├── app/                    # App Router de Next.js 13+
├── components/             # Componentes reutilizables
├── services/              # Servicios de API
├── hooks/                 # Custom hooks
├── contexts/              # Contextos de React
├── lib/                   # Utilidades y configuraciones
├── public/                # Archivos estáticos
└── styles/                # Estilos globales
```

## 🛠️ Tecnologías

- **Next.js 15.3.1** - Framework de React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Framer Motion** - Animaciones
- **Axios** - Cliente HTTP
- **Next Cloudinary** - Integración con Cloudinary

## 🌐 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📝 Notas de Desarrollo

- El proyecto usa el App Router de Next.js 13+
- Los componentes están organizados por funcionalidad
- Se usa TypeScript para mejor desarrollo
- Tailwind CSS para estilos
- Framer Motion para animaciones suaves

## 🚀 Despliegue

El proyecto está configurado para desplegarse fácilmente en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. ¡Listo! Se desplegará automáticamente

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
