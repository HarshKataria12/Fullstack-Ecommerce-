import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const storedAddress = localStorage.getItem('shippingAddress');
    return storedAddress ? JSON.parse(storedAddress) : {};
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const storedPayment = localStorage.getItem('paymentMethod');
    return storedPayment ? JSON.parse(storedPayment) : null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (shippingAddress && Object.keys(shippingAddress).length > 0) {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (paymentMethod) {
      localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    }
  }, [paymentMethod]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
                item.id === product.id ? { ...item, qty: (item.qty || 1) + qty } : item 
            );
        }
        return [...prevItems, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  const updateCartQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
  };

  const clearCheckoutData = () => {
    setShippingAddress({});
    setPaymentMethod(null);
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.price) * (item.qty || 1), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      updateCartQty,      
      clearCart,
      shippingAddress, 
      saveShippingAddress,
      paymentMethod,
      savePaymentMethod,
      clearCheckoutData,
      cartTotal,            
      cartCount             
    }}>
      {children}
    </CartContext.Provider>
  );
};