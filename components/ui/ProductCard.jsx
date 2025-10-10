'use client';

import React from 'react';
import Image from 'next/image';

const ProductCard = ({ product, onQuickView }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:scale-105 transform">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Featured
          </div>
        )}
        
        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6"
        >
          <span className="">
    
          </span>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="text-xs">
            {product.stock > 0 ? (
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                In Stock
              </span>
            ) : (
              <span className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        {/* Category */}
        <div className="mt-3">
          <span className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;