'use client';

import React from 'react';
import { useCart } from '@/lib/store/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, phone, setPhone } = useCart();

  const handleQuantityChange = (itemIndex, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemIndex);
    } else {
      updateQuantity(itemIndex, newQuantity);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl">
            <div className="text-pink-400 mb-4">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Your cart is empty
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg inline-block text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Shopping Cart
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
              <div className="divide-y divide-pink-100">
                {cart.items.map((item, index) => (
                  <div key={`${item._id}-${item.selectedShade?.code || 'no-shade'}-${index}`} className="p-4 sm:p-6 hover:bg-pink-50/30 transition-colors">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details - Flexible Layout */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                              {item.name}
                            </h3>
                            {/* Show selected shade */}
                            {item.selectedShade && (
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.selectedShade.code }}
                                  title={item.selectedShade.name}
                                ></div>
                                <span className="text-xs text-gray-600">{item.selectedShade.name}</span>
                              </div>
                            )}
                          </div>
                          {/* Remove Button - Mobile Top Right */}
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 p-1 hover:scale-110 transition-transform sm:hidden"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      
                        
                        {/* Mobile: Quantity and Price in Row */}
                        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 flex items-center justify-center hover:scale-110 transition-transform text-pink-600 font-bold text-lg"
                            >
                              -
                            </button>
                            <span className="font-semibold text-base sm:text-lg w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 flex items-center justify-center hover:scale-110 transition-transform text-pink-600 font-bold text-lg"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                              Rs{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button - Desktop Only */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="hidden sm:block text-red-500 hover:text-red-700 p-2 hover:scale-110 transition-transform"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Order Summary
              </h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal ({cart.items.reduce((total, item) => total + item.quantity, 0)} items):</span>
                  <span className="font-semibold">Rs{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">Rs250.00</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Tax (2%):</span>
                  <span className="font-semibold">Rs{(cart.total * 0.02).toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-pink-100 pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Rs{(cart.total + 250 + (cart.total * 0.02)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Optional number: lets us save the cart and follow up on WhatsApp */}
              <div className="mb-4">
                <label htmlFor="cart-phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  WhatsApp number <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="cart-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500">We&apos;ll keep your cart safe and may message you on WhatsApp about it.</p>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 sm:py-4 px-4 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-center block mb-3 sm:mb-4 text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/"
                className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 sm:py-4 px-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 text-center block text-sm sm:text-base"
              >
                Continue Shopping
              </Link>

              {/* Security Features */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-pink-100">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center space-x-2 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;