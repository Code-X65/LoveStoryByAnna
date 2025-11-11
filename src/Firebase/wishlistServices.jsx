import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './Firebase';

// Add product to wishlist
export const addToWishlist = async (userId, productData) => {
  try {
    // Check if product already exists in wishlist
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const q = query(wishlistRef, where('productId', '==', productData.id));
    const existingItems = await getDocs(q);
    
    if (!existingItems.empty) {
      return { success: false, error: 'Product already in wishlist' };
    }

    await addDoc(wishlistRef, {
      productId: productData.id,
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      discount: productData.discount,
      image: productData.images[0],
      brand: productData.brand,
      rating: productData.rating,
      stock: productData.stock,
      addedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Product added to wishlist' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user wishlist
export const getUserWishlist = async (userId) => {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const snapshot = await getDocs(wishlistRef);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        wishlistItemId: doc.id,
        ...doc.data()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId, wishlistItemId) => {
  try {
    const wishlistItemRef = doc(db, 'users', userId, 'wishlist', wishlistItemId);
    await deleteDoc(wishlistItemRef);
    return { success: true, message: 'Item removed from wishlist' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if product is in wishlist
export const isInWishlist = async (userId, productId) => {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const q = query(wishlistRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty ? snapshot.docs[0].id : null;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return null;
  }
};

// Clear entire wishlist
export const clearWishlist = async (userId) => {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const snapshot = await getDocs(wishlistRef);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { success: true, message: 'Wishlist cleared' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};