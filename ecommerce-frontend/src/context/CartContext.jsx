// This code creates the cart, checks localStorage (so they don't lose their cart if they refresh the page), and handles adding/removing items:
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product) => {
    setCartItems((prevItems) => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};