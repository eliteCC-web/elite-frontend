// app/layout.tsx - ACTUALIZACIÓN con AuthProvider
import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { ChatWithEli } from "@/components/ChatWithEli"
import { ThemeProvider } from "@/components/theme-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// Get the base URL dynamically
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.RAILWAY_STATIC_URL) return `https://${process.env.RAILWAY_STATIC_URL}`
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  return 'https://elite-frontend-production.up.railway.app'
}

export const metadata: Metadata = {
  title: "elite Centro Comercial",
  description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
  keywords: ["centro comercial", "cali", "elite", "shopping", "tiendas", "servicios"],
  authors: [{ name: "elite Centro Comercial" }],
  creator: "elite Centro Comercial",
  publisher: "elite Centro Comercial",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "elite Centro Comercial",
    description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
    url: getBaseUrl(),
    siteName: 'elite Centro Comercial',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "elite Centro Comercial",
    description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <ChatWithEli />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}