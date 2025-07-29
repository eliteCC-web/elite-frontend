/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración optimizada para Railway
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'pmulriauzstmyeslfvpn.supabase.co'],
  },
  // Configuración para Railway
  poweredByHeader: false,
  // Configuración para manejar SSL en Railway
  async headers() {
    // Solo aplicar headers de seguridad en producción
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload'
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https: http: https://maps.googleapis.com https://maps.gstatic.com; connect-src 'self' https: wss: https://maps.googleapis.com; frame-src 'self' https://www.google.com https://maps.googleapis.com; media-src 'self' https://pmulriauzstmyeslfvpn.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self';"
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            }
          ],
        },
      ]
    }
    
    // En desarrollo, no aplicar headers restrictivos
    return []
  },
  // Configuración para Railway
  env: {
    PORT: process.env.PORT || '3000',
  },
};

export default nextConfig;