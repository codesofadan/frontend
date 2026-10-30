'use client';

import { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import { cartAPI } from '@/lib/api';
import { getCid } from '@/lib/visitor';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_TO_CART':
      // Create a unique identifier for the product including shade
      const uniqueId = action.payload.selectedShade 
        ? `${action.payload._id}-${action.payload.selectedShade.code}`
        : action.payload._id;
      
      const existingItem = state.items.find(item => {
        const itemUniqueId = item.selectedShade 
          ? `${item._id}-${item.selectedShade.code}`
          : item._id;
        return itemUniqueId === uniqueId;
      });
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => {
            const itemUniqueId = item.selectedShade 
              ? `${item._id}-${item.selectedShade.code}`
              : item._id;
            return itemUniqueId === uniqueId
              ? { ...item, quantity: item.quantity + 1 }
              : item;
          }),
          total: state.total + action.payload.price
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    
    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find((item, index) => index === action.payload);
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter((item, index) => index !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
    
    case 'UPDATE_QUANTITY':
      const { itemIndex, quantity } = action.payload;
      const item = state.items[itemIndex];
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  // Phone the shopper typed on the cart page (or ordered with before), kept on this device only
  const [phone, setPhoneState] = useState('');
  const serverHasCart = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hudamoji-cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
    setPhoneState(localStorage.getItem('hudamoji-phone') || '');
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hudamoji-cart', JSON.stringify(cart));
  }, [cart]);

  // Tell the server what is in the cart so the store owner can follow up if the shopper leaves.
  // Without a phone number it is stored anonymously (visible, but nobody can be messaged).
  useEffect(() => {
    const hasItems = cart.items.length > 0;
    if (!hasItems && !serverHasCart.current) return; // nothing was sent, nothing to clear
    serverHasCart.current = hasItems;
    const timer = setTimeout(() => {
      cartAPI.save({
        cid: getCid(),
        phone: phone.replace(/\D/g, '').length >= 10 ? phone : undefined,
        items: cart.items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          selectedShade: item.selectedShade
        }))
      }).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [cart.items, phone]);

  const setPhone = (value) => {
    setPhoneState(value);
    localStorage.setItem('hudamoji-phone', value);
  };

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (itemIndex) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemIndex });
  };

  const updateQuantity = (itemIndex, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemIndex);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemIndex, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      phone,
      setPhone,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};