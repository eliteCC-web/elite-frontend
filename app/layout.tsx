import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
// Importamos desde nuestro tipo personalizado
import { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Centro Comercial Elite",
  description: "Tu destino favorito para compras, gastronomía y entretenimiento",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}