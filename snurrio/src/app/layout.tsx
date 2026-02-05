import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Movie Carousel - Browse and Save Your Favorite Movies',
  description:
    'Discover movies with an interactive carousel interface. Browse through curated collections, save your favorites, and explore new films. Built with Next.js and OMDb API.',
  keywords: [
    'movies',
    'film',
    'cinema',
    'movie carousel',
    'movie browser',
    'favorites',
  ],
  authors: [{ name: 'Steven Spielberg' }],
  openGraph: {
    title: 'Movie Carousel - Browse and Save Your Favorite Movies',
    description:
      'Discover movies with an interactive carousel interface. Browse, save favorites, and explore new films.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
