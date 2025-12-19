// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADEC PSP Sandbox',
  description: 'API Sandbox for ADEC PSP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-gray-50 text-gray-900`}
        suppressHydrationWarning={true} // ← Solution simple
      >
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}