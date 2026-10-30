'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/store/CartContext';
import { productAPI, orderAPI, cartAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { getCid } from '@/lib/visitor';

const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, phone: savedPhone, setPhone: savePhone } = useCart();
  
  const [checkoutItems, setCheckoutItems] = useState([]);
  const orderPlaced = useRef(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    phone: '',
    
    // Shipping Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    
    // Order Details
    paymentMethod: 'cod',
    notes: ''
  });

  // Initialize checkout items
  useEffect(() => {
    const initializeCheckout = async () => {
      // clearCart() after a successful order re-runs this effect: don't bounce the shopper home.
      if (orderPlaced.current) return;
      try {
        const productId = searchParams.get('product');
        const quantity = parseInt(searchParams.get('quantity')) || 1;
        
        if (productId) {
          // Check sessionStorage first for Buy Now flow (includes shade data)
          const buyNowData = sessionStorage.getItem('buyNowProduct');
          
          if (buyNowData) {
            try {
              const { product, quantity: buyNowQuantity } = JSON.parse(buyNowData);
              if (product._id === productId) {
                // Use Buy Now product data with shade
                setCheckoutItems([{
                  ...product,
                  quantity: buyNowQuantity
                }]);
                // Clear sessionStorage after using
                sessionStorage.removeItem('buyNowProduct');
                setLoading(false);
                return;
              }
            } catch (e) {
              console.error('Error parsing buyNowProduct:', e);
            }
          }
          
          // Fallback: check cart for the product
          const cartItem = cart.items.find(item => item._id === productId);
          
          if (cartItem) {
            // Use cart item which has shade data
            setCheckoutItems([{
              ...cartItem,
              quantity: quantity
            }]);
          } else {
            // Last resort: fetch from API if not in cart or sessionStorage
            const response = await productAPI.getById(productId);
            if (response.success) {
              setCheckoutItems([{
                ...response.data,
                quantity: quantity
              }]);
            }
          }
        } else if (cart.items.length > 0) {
          // Cart checkout
          setCheckoutItems(cart.items);
        } else {
          // No items to checkout
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error initializing checkout:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [searchParams, cart.items, router]);

  // A number left on the cart page (or from a past order) pre-fills the form.
  useEffect(() => {
    if (savedPhone) setFormData(f => (f.phone ? f : { ...f, phone: savedPhone }));
  }, [savedPhone]);

  // Once a valid phone number is typed, save the cart so the store owner can follow up on WhatsApp
  // if the order is never placed. Debounced; stops for good once the order goes through.
  useEffect(() => {
    if (orderPlaced.current || checkoutItems.length === 0 || formData.phone.replace(/\D/g, '').length < 10) return;
    const timer = setTimeout(() => {
      if (orderPlaced.current) return;
      cartAPI.save({
        cid: getCid(),
        phone: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        items: checkoutItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          selectedShade: item.selectedShade
        }))
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData.phone, formData.firstName, formData.lastName, checkoutItems]);

  const calculateTotals = () => {
    const subtotal = checkoutItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const shipping = 250; // Fixed shipping fee of 250 Rs
    const tax = subtotal * 0.02; // 2% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    orderPlaced.current = true; // stop cart capture while the order is in flight

    try {
      const { subtotal, shipping, tax, total } = calculateTotals();
      
      const orderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        items: checkoutItems.map(item => {
          const orderItem = {
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0]?.url || ''
          };
          // Only include selectedShade if it exists
          if (item.selectedShade) {
            orderItem.selectedShade = {
              name: item.selectedShade.name,
              code: item.selectedShade.code
            };
          }
          return orderItem;
        }),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      // Create order in database
      const response = await orderAPI.create(orderData);
      
      if (response.success) {
        // Clear cart if it was a cart checkout
        if (!searchParams.get('product')) {
          clearCart();
        }
        
        // Next orders and carts from this device are tied to this number
        savePhone(formData.phone);

        // The token is what lets the confirmation page read this order
        router.push(`/order-confirmation?orderId=${response.data._id}&token=${response.data.accessToken}`);
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (error) {
      console.error('Error processing order:', error);
      orderPlaced.current = false;
      alert(error.message || 'Error processing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Checkout
            </span>
          </h1>
          <p className="text-gray-600 mt-2">Complete your order below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92XXXXXXXXXX"
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500">We may message you on WhatsApp about your order or cart.</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 transition-colors text-black placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors text-black placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 transition-colors text-black"
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="India">India</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center bg-white/50 p-4 rounded-2xl border-2 border-gray-200 hover:border-pink-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="font-medium">Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center bg-white/50 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleInputChange}
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-medium">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 transition-colors resize-none text-black placeholder-gray-400"
                  placeholder="Any special instructions for your order..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {submitting ? 'Processing Order...' : `Place Order - Rs${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Order Summary
            </h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {checkoutItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-3 hover:bg-pink-50/30 rounded-2xl transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.selectedShade && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.selectedShade.code }}
                        ></div>
                        <span className="text-xs text-gray-600">{item.selectedShade.name}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                      Rs{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Rs{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t-2 border-pink-100 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">Rs{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">Rs{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (2%):</span>
                <span className="font-semibold">Rs{tax.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-pink-100 pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Rs{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t-2 border-pink-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Free shipping on orders over Rs250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-pink-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;