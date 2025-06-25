# Diagnóstico de Problemas de Email

## Pasos para Diagnosticar

### 1. Probar la Configuración
1. Ve a la página de registro interno: `/register-internal`
2. Usa el componente de prueba de email en la parte superior
3. Ingresa tu email y nombre
4. Haz clic en "Probar Email"
5. Revisa los resultados

### 2. Verificar Variables de Entorno
Asegúrate de que en tu archivo `.env.local` tengas:

```env
BREVO_API=tu_api_key_de_brevo
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Verificar Logs del Backend
Revisa los logs del backend cuando intentes registrar un usuario interno. Deberías ver:

```
Starting email verification process for internal registration: tu@email.com
User ID: 123, User Name: TuNombre
Attempting to send email to tu@email.com with Brevo API
Frontend URL: http://localhost:3000
Sender email: elitecc.soporte@gmail.com
Reply to email: elitecc.soporte@gmail.com
Recipient email: tu@email.com
Recipient name: TuNombre
Sending email with Brevo API to tu@email.com
Brevo API response: {...}
Message ID: abc123
Verification email sent successfully to tu@email.com for internal registration
```

### 4. Posibles Problemas y Soluciones

#### Problema: BREVO_API no configurada
**Síntomas**: Error "BREVO_API environment variable is not set"
**Solución**: 
1. Obtén tu API key de Brevo
2. Agrega `BREVO_API=tu_api_key` a tu `.env.local`
3. Reinicia el servidor backend

#### Problema: Email en spam/carpeta de promociones
**Síntomas**: El email se envía exitosamente pero no llega a la bandeja principal
**Solución**:
1. Revisa la carpeta de spam
2. Revisa la carpeta de promociones (Gmail)
3. Marca el email como "no es spam"
4. Agrega `elitecc.soporte@gmail.com` a tus contactos

#### Problema: Error de API de Brevo
**Síntomas**: Error en la respuesta de Brevo API
**Solución**:
1. Verifica que tu API key sea válida
2. Verifica que tu cuenta de Brevo esté activa
3. Revisa los límites de envío de tu cuenta

#### Problema: Email con caracteres especiales
**Síntomas**: El "glitch" de Google no funciona
**Solución**:
1. Usa un email real sin caracteres especiales
2. Verifica que el email esté bien formateado
3. Prueba con diferentes proveedores de email

### 5. Comandos de Diagnóstico

#### Verificar variables de entorno en el backend:
```bash
cd elite-backend
echo $BREVO_API
echo $FRONTEND_URL
```

#### Verificar logs del backend:
```bash
cd elite-backend
npm run start:dev
# Luego intenta registrar un usuario y revisa los logs
```

#### Probar endpoint directamente:
```bash
curl -X POST http://localhost:3001/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","name":"Tu Nombre"}'
```

### 6. Información para Reportar el Problema

Si el problema persiste, proporciona:

1. **Resultado del componente de prueba**
2. **Logs del backend** (especialmente los relacionados con email)
3. **Variables de entorno** (sin mostrar la API key completa)
4. **Email que estás usando**
5. **Proveedor de email** (Gmail, Outlook, etc.)
6. **Si revisaste spam/promociones**

### 7. Alternativas Temporales

Si el email no funciona, podemos:

1. **Implementar verificación manual** por administrador
2. **Usar otro servicio de email** (SendGrid, Mailgun, etc.)
3. **Implementar verificación por SMS**
4. **Crear un sistema de códigos de verificación**

---

**Nota**: Una vez que identifiquemos y solucionemos el problema, removeremos el componente de prueba de la página de registro. 