// WhatsApp utility functions for order processing

/**
 * Format cart items and customer info into a WhatsApp message
 * @param {Object} orderData - Order data including items, customer info, totals
 * @returns {string} Formatted WhatsApp message
 */
export const formatWhatsAppMessage = (orderData) => {
  const {
    customerInfo,
    shippingAddress,
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod,
    notes
  } = orderData;

  let message = `🛍️ *NEW ORDER REQUEST*\n\n`;

  // Customer Information
  message += `👤 *Customer Details:*\n`;
  message += `Name: ${customerInfo.firstName} ${customerInfo.lastName}\n`;
  message += `Phone: ${customerInfo.phone}\n\n`;

  // Shipping Address
  message += `📍 *Shipping Address:*\n`;
  message += `${shippingAddress.street}\n`;
  message += `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n`;
  message += `${shippingAddress.country}\n\n`;

  // Order Items
  message += `📦 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Price: $${item.price.toFixed(2)} x ${item.quantity}\n`;
    message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
  });

  // Order Summary
  message += `💰 *Order Summary:*\n`;
  message += `Subtotal: $${subtotal.toFixed(2)}\n`;
  message += `Shipping: ${shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}\n`;
  message += `Tax: $${tax.toFixed(2)}\n`;
  message += `*Total: $${total.toFixed(2)}*\n\n`;

  // Payment Method
  message += `💳 *Payment Method:* ${paymentMethod.toUpperCase()}\n\n`;

  // Additional Notes
  if (notes && notes.trim()) {
    message += `📝 *Additional Notes:*\n${notes}\n\n`;
  }

  message += `✅ Please confirm this order to proceed with processing.`;

  return message;
};

/**
 * Generate WhatsApp URL with pre-filled message
 * @param {string} phoneNumber - WhatsApp number (without + or country code formatting)
 * @param {string} message - Pre-filled message
 * @returns {string} WhatsApp URL
 */
export const generateWhatsAppURL = (phoneNumber, message) => {
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Format phone number (remove any non-numeric characters)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Return WhatsApp URL (works on both mobile and desktop)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Redirect to WhatsApp with order details
 * @param {Object} orderData - Order data to send via WhatsApp
 * @param {string} whatsappNumber - Business WhatsApp number
 */
export const redirectToWhatsApp = (orderData, whatsappNumber = '923299432955') => {
  const message = formatWhatsAppMessage(orderData);
  const whatsappURL = generateWhatsAppURL(whatsappNumber, message);
  
  // Open WhatsApp in new tab/window
  window.open(whatsappURL, '_blank');
};