# Configuración del Chat con Eli

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto `elite-frontend` con las siguientes variables:

```env
# API Chat URL - Reemplaza con tu URL de Railway del servicio elite-ai
NEXT_PUBLIC_API_CHAT_URL=https://tu-elite-ai-service.railway.app

# Avatar de Eli - Reemplaza con tu URL de Supabase
NEXT_PUBLIC_ELI_AVATAR_URL=https://tu-supabase-url.supabase.co/storage/v1/object/public/tu-bucket/eli-avatar.jpg

# Logo del oso para el botón flotante - Reemplaza con tu URL de Supabase
NEXT_PUBLIC_ELI_BEAR_LOGO_URL=https://tu-supabase-url.supabase.co/storage/v1/object/public/tu-bucket/eli-bear-logo.png
```

## Pasos de Configuración

1. **Configurar la URL del API Chat:**
   - Ve a tu proyecto en Railway
   - Copia la URL del servicio `elite-ai`
   - Reemplaza `https://tu-elite-ai-service.railway.app` con tu URL real

2. **Configurar el Avatar de Eli:**
   - Sube una imagen de perfil para Eli a tu bucket de Supabase
   - Copia la URL pública de la imagen
   - Reemplaza la URL en `NEXT_PUBLIC_ELI_AVATAR_URL`

3. **Configurar el Logo del Oso:**
   - Sube una imagen del logo del oso a tu bucket de Supabase
   - Recomendado: imagen PNG con fondo transparente, 32x32px o 64x64px
   - Copia la URL pública de la imagen
   - Reemplaza la URL en `NEXT_PUBLIC_ELI_BEAR_LOGO_URL`

## Características del Chat

- ✅ Chat flotante en la esquina inferior derecha
- ✅ **Logo del oso personalizable** en el botón flotante
- ✅ Diseño consistente con el resto de la web app
- ✅ Avatar personalizable de Eli
- ✅ Historial de mensajes por sesión
- ✅ Indicador de "escribiendo..."
- ✅ Minimizar/maximizar ventana
- ✅ Responsive design
- ✅ Integración con el API de elite-ai

## Notas Importantes

- El chat está disponible en todas las páginas de la aplicación
- Los mensajes se almacenan en la base de datos del servicio elite-ai
- El avatar de Eli se muestra en todos los mensajes del asistente
- **El logo del oso se muestra en el botón flotante**
- El diseño sigue la paleta de colores y estilos de Elite Centro Comercial

## Especificaciones de Imágenes

### Logo del Oso (Botón Flotante)
- **Formato**: PNG recomendado (con fondo transparente)
- **Tamaño**: 32x32px o 64x64px
- **Estilo**: Logo limpio y reconocible
- **Fondo**: Transparente para mejor integración

### Avatar de Eli (Chat)
- **Formato**: JPG o PNG
- **Tamaño**: 40x40px (se redimensiona automáticamente)
- **Estilo**: Foto de perfil profesional
- **Fondo**: Cualquier color (se muestra en círculo) 