'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { orderAPI } from '@/lib/api';

const OrderConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrder = async (orderId) => {
    try {
      const response = await orderAPI.getById(orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">Thank you for your order. We&apos;ll process it shortly.</p>
          {order && (
            <div className="mt-4 inline-block bg-white px-6 py-3 rounded-full shadow-lg">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-mono">
                {order.orderNumber}
              </p>
            </div>
          )}
        </div>

        {order && (
          <>
            {/* Order Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
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
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedShade.code }}
                          ></div>
                          <span className="text-sm text-gray-600">{item.selectedShade.name}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-pink-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">Rs {order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium">Rs {order.shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (2%):</span>
                  <span className="font-medium">Rs {order.tax?.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-pink-200 pt-3 flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Rs {order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Customer</h3>
                  <p className="text-gray-900 font-medium">
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                  </p>
                  <p className="text-gray-600">{order.customerInfo?.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Delivery Address</h3>
                  <p className="text-gray-900">
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Status Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Next?</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-green-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Received</p>
                <p className="text-sm text-gray-600">We&apos;ve received your order and will process it shortly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation Call</p>
                <p className="text-sm text-gray-600">Our team will contact you at {order?.customerInfo?.phone} to confirm your order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-purple-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Delivery</p>
                <p className="text-sm text-gray-600">Your order will be delivered to your address. Delivery charges: Rs 250</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-pink-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment on Delivery</p>
                <p className="text-sm text-gray-600">Pay cash when you receive your order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">If you have any questions about your order, feel free to contact us:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+923299432955"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
              </svg>
              WhatsApp: +92 329 943 2955
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 text-center shadow-lg"
          >
            Continue Shopping
          </Link>
          
          <button
            onClick={() => window.open('https://wa.me/923299432955', '_blank')}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
            </svg>
            Open WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderConfirmationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
};

export default OrderConfirmationPage;