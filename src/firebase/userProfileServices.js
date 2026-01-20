import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Get user profile
export const getUserProfile = async (userId) => {
    if (!userId) return { success: false, error: 'User ID is required' };
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: true, data: null };
        }

        const data = docSnap.data();

        // Already stored in friendly format (no need for complex mapping if we save it correctly)
        return {
            success: true,
            data: {
                ...data,
                displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim()
            }
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { success: false, error: error.message };
    }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    if (!userId) {
        console.error('updateUserProfile: userId is undefined');
        return { success: false, error: 'User ID is required' };
    }
    try {
        const docRef = doc(db, 'users', userId);

        // Ensure we handle timestamp
        const finalUpdates = {
            ...updates,
            updatedAt: serverTimestamp()
        };

        // Remove undefined values to prevent Firestore errors
        Object.keys(finalUpdates).forEach(key => {
            if (finalUpdates[key] === undefined) {
                delete finalUpdates[key];
            }
        });

        // Use setDoc with merge for upsert behavior
        await setDoc(docRef, finalUpdates, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
};
