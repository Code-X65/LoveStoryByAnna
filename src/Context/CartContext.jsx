import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContextCore';
import { getUserCart, addToCart as addToCartService, updateCartItem, removeFromCart, clearCart as clearCartService } from '../firebase/cartServices';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper to add timeout to promises
const withTimeout = (promise, ms = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    )
  ]);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, loading: authLoading } = useAuth();

  // Merge guest cart with user cart on login
  const mergeGuestCart = useCallback(async (userId) => {
    const localCart = localStorage.getItem('guest_cart');
    if (!localCart) return;

    try {
      const guestItems = JSON.parse(localCart);
      if (guestItems.length === 0) return;

      // Add each guest item to user's cart
      for (const item of guestItems) {
        await addToCartService(userId, {
          id: item.productId,
          selectedSize: item.size,
          quantity: item.quantity
        });
      }

      // Clear guest cart after merge
      localStorage.removeItem('guest_cart');
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  }, []);

  // Load cart on mount or user change
  useEffect(() => {
    if (authLoading) return;

    const loadCart = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          // First merge any guest cart items
          await mergeGuestCart(currentUser.uid);

          // Then load the user's cart
          const items = await getUserCart(currentUser.uid);
          setCartItems(items || []);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle guest cart from localStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch (e) {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
        setLoading(false);
      }
    };

    loadCart();
  }, [currentUser, authLoading, mergeGuestCart]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!currentUser && cartItems.length > 0) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  const addItemToCart = async (product) => {
    if (currentUser) {
      const result = await addToCartService(currentUser.uid, product);
      if (result.success) {
        const items = await getUserCart(currentUser.uid);
        setCartItems(items);
        return { success: true };
      }
      return result;
    } else {
      // Guest logic
      const existingItemIndex = cartItems.findIndex(
        item => item.productId === product.id && item.size === product.selectedSize
      );

      if (existingItemIndex > -1) {
        const newCart = [...cartItems];
        newCart[existingItemIndex].quantity += product.quantity;
        setCartItems(newCart);
      } else {
        setCartItems(prev => [...prev, {
          cartItemId: `guest_${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image1 || product.images?.[0] || '',
          size: product.selectedSize,
          quantity: product.quantity,
          addedAt: new Date().toISOString()
        }]);
      }
      return { success: true };
    }
  };

  const removeItemFromCart = async (cartItemId) => {
    if (currentUser) {
      const result = await removeFromCart(currentUser.uid, cartItemId);
      if (result.success) {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      }
      return result;
    } else {
      setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      return { success: true };
    }
  };

  const updateItemQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return { success: false, error: 'Quantity must be at least 1' };

    if (currentUser) {
      const result = await updateCartItem(currentUser.uid, cartItemId, newQuantity);
      if (result.success) {
        setCartItems(prev => prev.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
        ));
      }
      return result;
    } else {
      setCartItems(prev => prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
      return { success: true };
    }
  };

  const clearUserCart = async () => {
    if (currentUser) {
      const result = await clearCartService(currentUser.uid);
      if (result.success) {
        setCartItems([]);
      }
      return result;
    } else {
      setCartItems([]);
      localStorage.removeItem('guest_cart');
      return { success: true };
    }
  };

  const clearCart = clearUserCart;

  const getCartItem = (productId, size) => {
    return cartItems.find(item => item.productId === productId && item.size === size);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearUserCart,
    clearCart,
    getCartItem,
    cartSubtotal,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


