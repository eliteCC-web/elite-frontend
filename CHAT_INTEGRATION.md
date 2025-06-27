# Integración del Chat con Eli

## Descripción

El chat con Eli es un asistente virtual integrado en el frontend de Elite Centro Comercial que permite a los usuarios hacer preguntas sobre el centro comercial, sus tiendas, servicios y eventos.

## Características

### ✅ Funcionalidades Implementadas
- **Chat flotante**: Botón flotante en la esquina inferior derecha
- **Logo del oso**: Botón personalizable con logo del oso
- **Diseño consistente**: Sigue la paleta de colores y estilos de Elite
- **Avatar personalizable**: Imagen de perfil de Eli configurable
- **Historial de mensajes**: Persistencia por sesión
- **Indicador de carga**: "Eli está escribiendo..."
- **Minimizar/Maximizar**: Control de ventana
- **Responsive**: Diseño adaptativo
- **Integración API**: Conexión con el servicio elite-ai
- **Manejo de errores**: Estados de servicio no disponible
- **Auto-scroll**: Navegación automática a nuevos mensajes

### 🎨 Diseño y UX
- **Colores**: Gradiente primary-500 a primary-600
- **Tipografía**: Consistente con el resto de la app
- **Animaciones**: Transiciones suaves y hover effects
- **Accesibilidad**: ARIA labels y navegación por teclado
- **Iconografía**: Lucide React icons + Logo del oso personalizable

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL del servicio elite-ai en Railway
NEXT_PUBLIC_API_CHAT_URL=https://tu-elite-ai-service.railway.app

# Avatar de Eli (URL de Supabase)
NEXT_PUBLIC_ELI_AVATAR_URL=https://tu-supabase-url.supabase.co/storage/v1/object/public/tu-bucket/eli-avatar.jpg

# Logo del oso para el botón flotante (URL de Supabase)
NEXT_PUBLIC_ELI_BEAR_LOGO_URL=https://tu-supabase-url.supabase.co/storage/v1/object/public/tu-bucket/eli-bear-logo.png
```

### 2. Configurar Avatar de Eli

1. Sube una imagen de perfil para Eli a tu bucket de Supabase
2. Copia la URL pública de la imagen
3. Actualiza `NEXT_PUBLIC_ELI_AVATAR_URL` en `.env.local`

### 3. Configurar Logo del Oso

1. Sube una imagen del logo del oso a tu bucket de Supabase
2. **Recomendado**: PNG con fondo transparente, 32x32px o 64x64px
3. Copia la URL pública de la imagen
4. Actualiza `NEXT_PUBLIC_ELI_BEAR_LOGO_URL` en `.env.local`

### 4. Verificar Servicio elite-ai

Asegúrate de que el servicio `elite-ai` esté desplegado y funcionando en Railway.

## Estructura de Archivos

```
elite-frontend/
├── components/
│   └── ChatWithEli.tsx          # Componente principal del chat
├── hooks/
│   └── useChat.ts               # Hook personalizado para lógica del chat
├── services/
│   └── chat.service.ts          # Servicio para llamadas al API
└── app/
    └── layout.tsx               # Layout principal (incluye ChatWithEli)
```

## Uso

### Componente Principal
```tsx
import { ChatWithEli } from '@/components/ChatWithEli';

// El componente se incluye automáticamente en el layout
// No es necesario importarlo en páginas individuales
```

### Hook Personalizado
```tsx
import { useChat } from '@/hooks/useChat';

function MyComponent() {
  const { messages, isLoading, sendMessage } = useChat();
  
  // Usar la lógica del chat
}
```

### Servicio de Chat
```tsx
import { chatService } from '@/services/chat.service';

// Enviar mensaje
const response = await chatService.sendMessage(message, sessionId);

// Verificar salud del servicio
const isHealthy = await chatService.checkHealth();
```

## Estados del Chat

### Estados de Servicio
- **Disponible**: Chat funcional, mensajes se envían correctamente
- **No disponible**: Servicio offline, input deshabilitado
- **Cargando**: Mensaje en proceso de envío

### Estados de UI
- **Cerrado**: Solo botón flotante con logo del oso visible
- **Abierto**: Ventana de chat completa
- **Minimizado**: Solo header visible

## API Endpoints

El chat se conecta con los siguientes endpoints del servicio elite-ai:

- `POST /api/chat/send` - Enviar mensaje
- `GET /api/chat/history` - Obtener historial
- `POST /api/chat/feedback` - Guardar feedback
- `GET /health` - Verificar salud del servicio

## Personalización

### Cambiar Avatar de Eli
Actualiza `NEXT_PUBLIC_ELI_AVATAR_URL` en `.env.local`

### Cambiar Logo del Oso
Actualiza `NEXT_PUBLIC_ELI_BEAR_LOGO_URL` en `.env.local`

### Cambiar Mensaje de Bienvenida
Edita el mensaje inicial en `hooks/useChat.ts`:

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: '1',
    message: 'Tu mensaje personalizado aquí',
    isUser: false,
    timestamp: new Date()
  }
]);
```

### Cambiar Colores
Los colores se basan en las clases de Tailwind CSS:
- `primary-500` y `primary-600` para el gradiente
- `neutral-50`, `neutral-200`, etc. para fondos y bordes

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

## Troubleshooting

### Chat no responde
1. Verifica que `NEXT_PUBLIC_API_CHAT_URL` esté configurada
2. Confirma que el servicio elite-ai esté funcionando
3. Revisa la consola del navegador para errores

### Avatar no se muestra
1. Verifica que `NEXT_PUBLIC_ELI_AVATAR_URL` esté configurada
2. Confirma que la URL sea accesible públicamente
3. Verifica permisos del bucket de Supabase

### Logo del oso no se muestra
1. Verifica que `NEXT_PUBLIC_ELI_BEAR_LOGO_URL` esté configurada
2. Confirma que la URL sea accesible públicamente
3. Verifica que la imagen tenga el formato correcto

### Errores de CORS
1. Asegúrate de que el servicio elite-ai tenga CORS configurado
2. Verifica que las URLs coincidan exactamente

## Próximas Mejoras

- [ ] Persistencia de chat en localStorage
- [ ] Notificaciones push para mensajes
- [ ] Soporte para archivos adjuntos
- [ ] Integración con sistema de usuarios
- [ ] Analytics de uso del chat
- [ ] Temas personalizables
- [ ] Soporte para múltiples idiomas 