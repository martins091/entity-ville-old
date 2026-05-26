import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/hooks/use-cart'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Entity Ville Ltd - Premium Electrical Components Supplier in Nigeria',
    template: '%s | Entity Ville Ltd'
  },
  description: 'Leading supplier of premium electrical components in Nigeria: cable trays, circuit breakers, earthing systems, busbars, lightning arrestors, conduits, and wiring devices. Trusted brands ABB, Schneider, Siemens.',
  keywords: [
    'electrical components supplier Nigeria',
    'cable trays Lagos',
    'circuit breakers ABB Schneider Siemens',
    'earthing systems',
    'busbars',
    'lightning arrestors',
    'conduit pipes',
    'wiring devices',
    'electrical accessories',
    'Entity Ville',
    'Surulere Lagos electrical supplier'
  ],
  authors: [{ name: 'Entity Ville Ltd' }],
  creator: 'Entity Ville Ltd',
  publisher: 'Entity Ville Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://entityville.com',
    siteName: 'Entity Ville Ltd',
    title: 'Entity Ville Ltd - Premium Electrical Components Supplier',
    description: 'Leading supplier of premium electrical components in Nigeria. Quality products from ABB, Schneider, Siemens, Chint, and Indelec.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Entity Ville - Electrical Components Supplier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Entity Ville Ltd - Premium Electrical Components Supplier',
    description: 'Quality electrical components: cable trays, circuit breakers, earthing systems, busbars, and more. Trusted brands across Nigeria.',
    images: ['/twitter-image.jpg'],
    creator: '@entityville',
  },
  alternates: {
    canonical: 'https://entityville.com',
  },
  category: 'Electrical Components Supply',
  classification: 'Electrical Equipment Supplier',
  icons: {
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
  verification: {
    google: 'your-google-site-verification-code', // Add your Google Search Console code
  },
  metadataBase: new URL('https://entityville.com'),
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  applicationName: 'Entity Ville Ltd',
  appleWebApp: {
    capable: true,
    title: 'Entity Ville',
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}