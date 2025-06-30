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
  metadataBase: new URL('https://elite-frontend-production.up.railway.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "elite Centro Comercial",
    description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
    url: 'https://elite-frontend-production.up.railway.app',
    siteName: 'elite Centro Comercial',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "elite Centro Comercial",
    description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
        <meta httpEquiv="X-Frame-Options" content="DENY" />
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