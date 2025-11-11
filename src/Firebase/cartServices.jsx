import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './Firebase';

// Add product to cart
export const addToCart = async (userId, productData) => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    
    await addDoc(cartRef, {
      productId: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.images[0],
      size: productData.selectedSize,
      quantity: productData.quantity,
      addedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Product added to cart' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user cart
export const getUserCart = async (userId) => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const q = query(cartRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        cartItemId: doc.id,
        ...doc.data()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Update cart item quantity
export const updateCartItem = async (userId, cartItemId, quantity) => {
  try {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await updateDoc(cartItemRef, { quantity });
    return { success: true, message: 'Cart updated' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove item from cart
export const removeFromCart = async (userId, cartItemId) => {
  try {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await deleteDoc(cartItemRef);
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clear entire cart
export const clearCart = async (userId) => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const snapshot = await getDocs(cartRef);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};