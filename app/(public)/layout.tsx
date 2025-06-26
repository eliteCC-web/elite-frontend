/* eslint-disable */

import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HomePageWrapper from "@/components/HomePageWrapper"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <HomePageWrapper>
      {children}
      </HomePageWrapper>
      <Footer />
    </>
  )
}
