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
  title: "Elite Centro Comercial",
  description: "Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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