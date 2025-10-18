'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/store/CartContext';

const ProductModal = ({ product, isOpen, onClose, onBuyNow }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleBuyNow = () => {
    // Add to cart first
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Then proceed to checkout
    onBuyNow(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors group"
          >
            <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]?.url || product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Product Images ({product.images.length})</p>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                          selectedImageIndex === index 
                            ? 'border-pink-500 shadow-lg ring-2 ring-pink-200' 
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                        {/* Image number indicator */}
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </div>
                        {/* Main image indicator */}
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Main
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                {/* Category */}
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 text-sm px-4 py-2 rounded-full font-medium">
                    {product.category}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Rs{product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through">
                      Rs{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>In Stock ({product.stock} available)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-4 py-2 rounded-full font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Out of Stock</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {/* <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div> */}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200 flex items-center justify-center hover:scale-110 transition-transform text-pink-600 font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="font-bold text-2xl w-16 text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200 flex items-center justify-center hover:scale-110 transition-transform text-pink-600 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Buy Now - Rs{(product.price * quantity).toFixed(2)}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 px-6 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-400 py-4 px-6 rounded-full font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;