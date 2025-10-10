import { Inter } from 'next/font/google'
import { CartProvider } from '@/lib/store/CartContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hudamoji - Quality Products at Great Prices',
  description: 'Discover amazing products at unbeatable prices. Quality you can trust, delivered right to your doorstep.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
