/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuraciones para evitar problemas de caché
  experimental: {
    // Mejorar el manejo de caché
    optimizeCss: true,
    // Evitar problemas con el hot reload
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Configuración de webpack para mejor manejo de caché
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (dev && !isServer) {
      // En desarrollo, deshabilitar la caché de webpack para evitar problemas
      config.cache = false;
    }
    return config;
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'pmulriauzstmyeslfvpn.supabase.co'],
  },
};

export default nextConfig;