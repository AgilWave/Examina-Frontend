// app/admin/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative control panel'
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <meta name="apple-mobile-web-app-title" content="Examina" />
    <body
      className={`${geistSans.variable} ${geistMono.variable} select-none antialiased`}
    >
      {children}
    </body>
  </html>
  )
}