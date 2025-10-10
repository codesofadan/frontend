'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/CartContext';

const Navbar = () => {
  const pathname = usePathname();
  const { getItemCount } = useCart();

  return (
    <nav className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 font-inter overflow-hidden">
      {/* Decorative background elements - smaller version for navbar */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Left */}
          <div className="flex">
            <Link href="/">
              {/* Logo image */}
              <img
                src="/hudamoji.png"
                alt="Hudamoji Logo"
                className="h-40 w-40 object-contain rounded"
              />
            </Link>
          </div>

          {/* Action Icons - Right */}
          <div className="flex items-center space-x-6">
            {/* Phone Icon */}
            <Link href="tel:+923001234567" className="text-gray-600 hover:text-pink-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </Link>

            {/* Shopify-style Cart Icon */}
            <Link href="/cart" className="text-gray-600 hover:text-pink-600 transition-colors relative">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"/>
              </svg>
              {/* Cart Badge */}
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Optional: Add a subtle bottom border or shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
    </nav>
  );
};

export default Navbar;