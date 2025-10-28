'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/CartContext';

const HeroWithNavbar = () => {
  const { getItemCount } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Add your image URLs here
  const slides = [
    '/hero (1).jpeg', // Replace with your actual image paths
    '/hero (2).jpeg',
    '/hero (3).jpeg',
    '/hero (4).jpeg',
    '/hero (5).jpeg',
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  // Handle touch events for swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

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
              <Link href="tel:+923299432955" className="text-gray-600 hover:text-pink-600 transition-colors">
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
      
      {/* Delivery Ticker */}
      <div className="relative z-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 overflow-hidden">
        <div className="flex animate-marquee">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center" aria-hidden="true">
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
            <span className="text-sm font-medium px-4">
              DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            </span>
          </div>
        </div>
      </div>
      
      {/* Image Slider */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={slide}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white w-6 sm:w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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