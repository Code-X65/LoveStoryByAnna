import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Add product to cart
export const addToCart = async (userId, productData) => {
    try {
        const cartRef = collection(db, 'users', userId, 'cart');

        // Check if item already exists in cart for this user
        const q = query(
            cartRef,
            where('product_id', '==', productData.id),
            where('size', '==', productData.selectedSize)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            const newQuantity = existingDoc.data().quantity + productData.quantity;
            return updateCartItem(userId, existingDoc.id, newQuantity);
        }

        // Add new item
        await addDoc(cartRef, {
            product_id: productData.id,
            quantity: productData.quantity,
            size: productData.selectedSize,
            color: productData.selectedColor || null,
            createdAt: serverTimestamp()
        });

        return { success: true, message: 'Product added to cart' };
    } catch (error) {
        console.error('Error in addToCart:', error);
        return { success: false, error: error.message };
    }
};

// Get user cart
export const getUserCart = async (userId) => {
    try {
        const cartRef = collection(db, 'users', userId, 'cart');
        const q = query(cartRef);
        const querySnapshot = await getDocs(q);

        // In Firestore we can't do joins like SQL. 
        // We fetch cart items and then fetch product details for each.
        const cartItems = await Promise.all(querySnapshot.docs.map(async (cartDoc) => {
            const itemData = cartDoc.data();
            const productRef = doc(db, 'products', itemData.product_id);
            const productSnap = await getDoc(productRef);

            const productData = productSnap.exists() ? productSnap.data() : null;

            return {
                cartItemId: cartDoc.id,
                productId: itemData.product_id,
                name: productData?.name || 'Unknown Product',
                price: productData?.price || 0,
                image: productData?.images?.[0] || '',
                size: itemData.size,
                color: itemData.color,
                quantity: itemData.quantity,
                addedAt: itemData.createdAt?.toDate?.() || new Date()
            };
        }));

        // Filter out items where product might have been deleted (optional)
        return cartItems.sort((a, b) => b.addedAt - a.addedAt);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
};

// Update cart item quantity
export const updateCartItem = async (userId, cartItemId, quantity) => {
    try {
        const docRef = doc(db, 'users', userId, 'cart', cartItemId);
        await updateDoc(docRef, { quantity });
        return { success: true, message: 'Cart updated' };
    } catch (error) {
        console.error('Error updating cart item:', error);
        return { success: false, error: error.message };
    }
};

// Remove item from cart
export const removeFromCart = async (userId, cartItemId) => {
    try {
        const docRef = doc(db, 'users', userId, 'cart', cartItemId);
        await deleteDoc(docRef);
        return { success: true, message: 'Item removed from cart' };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, error: error.message };
    }
};

// Clear entire cart
export const clearCart = async (userId) => {
    try {
        const cartRef = collection(db, 'users', userId, 'cart');
        const q = query(cartRef);
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        return { success: true, message: 'Cart cleared' };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return { success: false, error: error.message };
    }
};
