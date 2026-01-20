import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Add product to wishlist
export const addToWishlist = async (userId, productData) => {
    try {
        const wishlistRef = collection(db, 'users', userId, 'wishlist');

        // Check if product already exists in wishlist
        const q = query(
            wishlistRef,
            where('product_id', '==', productData.id)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return { success: false, error: 'Product already in wishlist' };
        }

        await addDoc(wishlistRef, {
            product_id: productData.id,
            createdAt: serverTimestamp()
        });

        return { success: true, message: 'Product added to wishlist' };
    } catch (error) {
        console.error('Error in addToWishlist:', error);
        return { success: false, error: error.message };
    }
};

// Get user wishlist
export const getUserWishlist = async (userId) => {
    try {
        const wishlistRef = collection(db, 'users', userId, 'wishlist');
        const q = query(wishlistRef);
        const querySnapshot = await getDocs(q);

        const wishlistItems = await Promise.all(querySnapshot.docs.map(async (wishDoc) => {
            const itemData = wishDoc.data();
            const productRef = doc(db, 'products', itemData.product_id);
            const productSnap = await getDoc(productRef);

            const productData = productSnap.exists() ? productSnap.data() : null;

            return {
                wishlistItemId: wishDoc.id,
                productId: itemData.product_id,
                name: productData?.name || 'Unknown Product',
                price: productData?.price || 0,
                originalPrice: productData?.originalPrice || productData?.original_price,
                discount: productData?.discount,
                image: productData?.images?.[0] || '',
                brand: productData?.brand,
                rating: productData?.rating,
                stock: productData?.stock,
                addedAt: itemData.createdAt?.toDate?.() || new Date()
            };
        }));

        return wishlistItems.sort((a, b) => b.addedAt - a.addedAt);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId, wishlistItemId) => {
    try {
        const docRef = doc(db, 'users', userId, 'wishlist', wishlistItemId);
        await deleteDoc(docRef);
        return { success: true, message: 'Item removed from wishlist' };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error: error.message };
    }
};

// Check if product is in wishlist
export const isInWishlist = async (userId, productId) => {
    try {
        const wishlistRef = collection(db, 'users', userId, 'wishlist');
        const q = query(
            wishlistRef,
            where('product_id', '==', productId)
        );

        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty ? querySnapshot.docs[0].id : null;
    } catch (error) {
        return null;
    }
};

// Clear entire wishlist
export const clearWishlist = async (userId) => {
    try {
        const wishlistRef = collection(db, 'users', userId, 'wishlist');
        const q = query(wishlistRef);
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        return { success: false, error: error.message };
    }
};
