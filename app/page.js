'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/ui/Hero';
import ProductCard from '@/components/ui/ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import ContactForm from '@/components/ui/ContactForm';
import Footer from '@/components/ui/Footer';
import { productAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setProducts([]);
        setPage(1);
        setHasMore(true);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          productAPI.getAll({ 
            category: selectedCategory === 'all' ? '' : selectedCategory,
            page: 1,
            limit: 10 
          }),
          productAPI.getCategories()
        ]);
        if (productsResponse.success) {
          setProducts(productsResponse.data);
          setHasMore(productsResponse.data.length === 10);
        }
        if (categoriesResponse.success) {
          setCategories(['all', ...categoriesResponse.data]);
        } else {
          // Fallback to hardcoded categories
          setCategories(['all', 'nails', 'hudamoji', 'mix brands']);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const productsResponse = await productAPI.getAll({ 
        category: selectedCategory === 'all' ? '' : selectedCategory,
        page: nextPage,
        limit: 10 
      });
      
      if (productsResponse.success) {
        if (productsResponse.data.length > 0) {
          setProducts(prev => [...prev, ...productsResponse.data]);
          setPage(nextPage);
          setHasMore(productsResponse.data.length === 10);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more product:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleBuyNow = (product, quantity) => {
    router.push(`/checkout?product=${product._id}&quantity=${quantity}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with integrated navbar */}
      <Navbar/>
   

      {/* Products Section */}
      <section id="products" className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Top Wave Transition */}
        <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-pink-600 tracking-wide uppercase mb-4">
              Exclusive Collection
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 block mt-2">
                Perfect Match
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our premium collection of quality products, carefully selected to meet your needs.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-4 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-105 min-w-[120px] sm:min-w-0 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <ProductCard
                      product={product}
                      onQuickView={handleQuickView}
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden"
                    />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && !loadingMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreProducts}
                    className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Load More Products
                  </button>
                </div>
              )}
              
              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="flex justify-center items-center py-8 mt-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Loading more products...</span>
                </div>
              )}
              
              {/* No More Products Message */}
              {!hasMore && products.length > 0 && (
                <div className="text-center py-8 mt-8">
                  <p className="text-gray-600">You&apos;ve reached the end of our collection!</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
                <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedCategory === 'all' 
                  ? "We're updating our collection. Check back soon for amazing products!" 
                  : `No products available in ${selectedCategory} category right now.`}
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View All Categories
              </button>
            </div>
          )}

        </div>

        {/* Bottom Wave Transition */}
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

      {/* Contact Section with matching style */}
      <section className="relative bg-white">
        <ContactForm />
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}

export default HomePage;