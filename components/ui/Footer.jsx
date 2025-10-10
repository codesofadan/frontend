'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const refundPolicy = (
  <div className="space-y-4 text-gray-700 text-sm">
    <h2 className="text-2xl font-bold text-pink-600 mb-2">Refund policy</h2>
    <p>
      We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
    </p>
    <p>
      To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
    </p>
    <p>
      To start a return, you can contact us at <a href="mailto:HUDAMOJI0@GMAIL.COM" className="text-pink-600 underline">HUDAMOJI0@GMAIL.COM</a>. Please note that returns will need to be sent to the following address: [INSERT RETURN ADDRESS]
    </p>
    <p>
      If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
    </p>
    <p>
      You can always contact us for any return question at <a href="mailto:HUDAMOJI0@GMAIL.COM" className="text-pink-600 underline">HUDAMOJI0@GMAIL.COM</a>
    </p>
    <h3 className="font-semibold mt-4">Damages and issues</h3>
    <p>
      Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
    </p>
    <h3 className="font-semibold mt-4">Exceptions / non-returnable items</h3>
    <p>
      Items from mix brand section will not be returnable or exchanged.<br />
      Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
    </p>
    <p>
      Unfortunately, we cannot accept returns on sale items or gift cards.
    </p>
    <h3 className="font-semibold mt-4">Exchanges</h3>
    <p>
      The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
    </p>
    <h3 className="font-semibold mt-4">Refunds</h3>
    <p>
      We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
      <br />
      If more than 15 business days have passed since we've approved your return, please contact us at <a href="mailto:HUDAMOJI0@GMAIL.COM" className="text-pink-600 underline">HUDAMOJI0@GMAIL.COM</a>
    </p>
    <div className="mt-4 text-xs text-gray-400">HUDAMOJI_OFFICIAL_PK</div>
  </div>
);

const Footer = () => {
  const [showRefund, setShowRefund] = useState(false);

  return (
    <footer className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white overflow-hidden">
      {/* Delivery Ticker */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          <span className="inline-block px-4 text-sm font-medium">
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
            DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • DELIVERY CHARGES RS 250 ALL OVER PAKISTAN • 
          </span>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      {/* Top Wave */}
      <div className="absolute top-10 left-0 w-full overflow-hidden rotate-180">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Hudamoji
            </h3>
            <p className="text-gray-600 text-sm">
              Your trusted online store for quality products at affordable prices. 
              We're committed to providing excellent customer service and fast delivery.
            </p>
            <div className="flex space-x-4">
              {/* Instagram Icon with Link */}
              <a 
                href="https://www.instagram.com/hudamoji_official_pk/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform group"
              >
                <svg className="w-5 h-5 text-purple-600 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                {/* Refund & Exchanges link triggers modal */}
                <button
                  type="button"
                  onClick={() => setShowRefund(true)}
                  className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm focus:outline-none"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all text-sm">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-600">
                  123 Business Street<br />
                  Lahore, Punjab 54000<br />
                  Pakistan
                </span>
              </div>
              
              <div className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-gray-600">+92 329 943 2955</span>
              </div>
              
              <div className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-600">HUDAMOJI0@GMAIL.COM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Policy Modal */}
        {showRefund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-xl font-bold z-10"
                  onClick={() => setShowRefund(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 pt-0">
                {refundPolicy}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-pink-200/30 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Hudamoji. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-sm transition-all">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-sm transition-all">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-sm transition-all">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;