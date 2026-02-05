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
  metadataBase: new URL('https://example.com'),
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
    images: [
      {
        url: '/dog.jpg',
        width: 1200,
        height: 630,
        alt: 'Movie Carousel preview',
      },
    ],
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-white focus:outline-none dark:focus:bg-white dark:focus:text-zinc-900"
        >
          Skip to main content
        </a>
        <div className="min-h-screen">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
