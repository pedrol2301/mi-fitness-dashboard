import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mi Fitness Dashboard",
  description: "Dashboard pessoal dos dados exportados do Mi Fitness",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
