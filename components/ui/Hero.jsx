'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/CartContext';

const HeroWithNavbar = () => {
  const { getItemCount } = useCart();

  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Navbar */}
      <nav className="relative z-20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Left */}
            <div className="flex">
              <Link href="/">
                <img
                  src="/hudamoji.png"
                  alt="Hudamoji Logo"
                  className="h-44 w-44 object-contain rounded"
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

              {/* Cart Icon */}
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
      </nav>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-10 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold text-pink-600 tracking-wide uppercase mb-4">
              Premium Beauty Collection
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unveil Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 block mt-2">
                Natural Radiance
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Discover our luxurious makeup collection crafted with premium ingredients. 
              Enhance your natural beauty with products that care for your skin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link
                href="#products"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Collection
              </Link>
              
              <Link
                href="#bestsellers"
                className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300"
              >
                View Bestsellers
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.9★</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">Cruelty-Free</p>
                <p className="text-sm text-gray-600">Certified</p>
              </div>
            </div>
          </div>
          
          {/* Product Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/hudahero.png" // Replace with your makeup product image
                alt="Premium Makeup Product"
                width={600}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
            
            {/* Decorative elements behind image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroWithNavbar;