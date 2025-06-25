/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración simplificada para Railway
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'pmulriauzstmyeslfvpn.supabase.co'],
  },
};

export default nextConfig;