import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'reviews';

/**
 * Add a new product review
 */
export const addReview = async (productId, userId, reviewData) => {
    try {
        const reviewsRef = collection(db, COLLECTION_NAME);
        const newReview = {
            productId,
            userId,
            ...reviewData,
            status: 'pending', // Reviews need moderation
            createdAt: serverTimestamp()
        };
        const docRef = await addDoc(reviewsRef, newReview);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get approved reviews for a specific product
 */
export const getProductReviews = async (productId) => {
    try {
        const reviewsRef = collection(db, COLLECTION_NAME);
        const q = query(
            reviewsRef,
            where('productId', '==', productId),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

/**
 * Mark a review as helpful (toggle - increment or decrement)
 */
export const markReviewHelpful = async (reviewId, userId) => {
    try {
        const reviewRef = doc(db, COLLECTION_NAME, reviewId);
        const reviewDoc = await getDoc(reviewRef);

        if (reviewDoc.exists()) {
            const data = reviewDoc.data();
            const currentHelpful = data.helpful || 0;
            const helpfulUsers = data.helpfulUsers || [];

            // Check if user already marked as helpful
            const userIndex = helpfulUsers.indexOf(userId);
            let newCount;
            let newHelpfulUsers;
            let isHelpful;

            if (userIndex > -1) {
                // User already marked as helpful, remove their vote
                newCount = Math.max(0, currentHelpful - 1);
                newHelpfulUsers = helpfulUsers.filter(id => id !== userId);
                isHelpful = false;
            } else {
                // User hasn't marked as helpful, add their vote
                newCount = currentHelpful + 1;
                newHelpfulUsers = [...helpfulUsers, userId];
                isHelpful = true;
            }

            await updateDoc(reviewRef, {
                helpful: newCount,
                helpfulUsers: newHelpfulUsers
            });

            return {
                success: true,
                newCount,
                isHelpful
            };
        }
        return { success: false, error: 'Review not found' };
    } catch (error) {
        console.error('Error marking review as helpful:', error);
        return { success: false, error: error.message };
    }
};
