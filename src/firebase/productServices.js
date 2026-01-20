import { collection, doc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Helper to map Firestore doc to frontend model
const mapProduct = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // If data was stored with snake_case in Firestore for some reason, map it
        originalPrice: data.original_price || data.originalPrice,
        isActive: data.is_active !== undefined ? data.is_active : data.isActive
    };
};

export const getAllProducts = async () => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapProduct);
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;
        return mapProduct(docSnap);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const getProductsByCategory = async (category) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapProduct);
    } catch (error) {
        console.error('Error fetching category products:', error);
        throw error;
    }
};

export const getProductsBySubcategory = async (category, subcategory) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category),
            where('subcategory', '==', subcategory),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapProduct);
    } catch (error) {
        console.error('Error fetching subcategory products:', error);
        throw error;
    }
};

export const searchProducts = async (searchQuery) => {
    try {
        // Firestore doesn't support full-text search. 
        // For simple apps, we fetch all and filter client-side or use prefix match.
        // Here we'll do a simple client-side filter for demonstration.
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const allProducts = querySnapshot.docs.map(mapProduct);

        const lowerQuery = searchQuery.toLowerCase();
        return allProducts.filter(p =>
            (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
            (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery))
        );
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const updateProductStock = async (productId, newStock) => {
    try {
        const docRef = doc(db, 'products', productId);
        await updateDoc(docRef, {
            stock: newStock,
            updatedAt: serverTimestamp()
        });

        const docSnap = await getDoc(docRef);
        return mapProduct(docSnap);
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};
