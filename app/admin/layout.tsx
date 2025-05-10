/* eslint-disable */

import type React from "react"
import AdminLayout from "@/components/admin/admin-layout" // Ajusta la ruta según donde tengas el AdminLayout

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
