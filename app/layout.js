import { Inter } from 'next/font/google'
import { CartProvider } from '@/lib/store/CartContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://hudamoji.pk'),
  title: {
    default: 'Hudamoji - The Best Beauty Products in Pakistan',
    template: '%s | Hudamoji Pakistan'
  },
  description: 'Shop Hudamoji for the best beauty products in Pakistan. Affordable cosmetics, nails, and makeup delivered to your doorstep. #1 Online Beauty Store.',
  keywords: ['hudamoji', 'hudamoji pakistan', 'hudamoji pk', 'hudamoji beauty', 'hudamoji products', 'cosmetics pakistan', 'online makeup shopping pakistan', 'affordable makeup'],
  authors: [{ name: 'Hudamoji Team' }],
  creator: 'Hudamoji',
  publisher: 'Hudamoji',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Hudamoji - The Best Beauty Products in Pakistan',
    description: 'Discover amazing beauty products, nails, and cosmetics at unbeatable prices. Hudamoji Pakistan is your go-to store for quality and affordability.',
    url: 'https://hudamoji.pk',
    siteName: 'Hudamoji Pakistan',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hudamoji Pakistan',
    description: 'Shop the best beauty products in Pakistan at Hudamoji.',
    creator: '@hudamoji',
  },
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
  alternates: {
    canonical: 'https://hudamoji.pk',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hudamoji Pakistan",
    "url": "https://hudamoji.pk",
    "alternateName": ["Hudamoji", "Hudamoji PK"],
    "description": "Online store for quality products including nails, Hudamoji products, and mix brands.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hudamoji.pk/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hudamoji Pakistan",
    "url": "https://hudamoji.pk",
    "logo": "https://hudamoji.pk/hudamoji.png",
    "sameAs": [
      "https://www.facebook.com/hudamoji",
      "https://www.instagram.com/hudamoji"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-329-9432955",
      "contactType": "customer service",
      "areaServed": "PK",
      "availableLanguage": "English"
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
