import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { TextSizeProvider } from '@/components/text-size-control'
import './globals.css'

export const metadata: Metadata = {
  title: 'DAM Academy — Aprende Java desde cero',
  description: 'Aprende programación Java paso a paso con lecciones, ejercicios y simuladores interactivos para primero de DAM.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <TextSizeProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </TextSizeProvider>
      </body>
    </html>
  )
}
