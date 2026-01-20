import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * Validate a coupon code
 * @param {string} code - The coupon code to validate
 * @returns {Object} - Result with valid status, discount type, and value
 */
export const validateCoupon = async (code) => {
    try {
        if (!code) return { valid: false, message: 'Invalid code' };

        const normalizedCode = code.toUpperCase().trim();

        // Query the 'coupons' collection
        const q = query(
            collection(db, 'coupons'),
            where('code', '==', normalizedCode),
            where('isActive', '==', true),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { valid: false, message: 'Coupon not found or expired' };
        }

        const couponData = snapshot.docs[0].data();
        const now = new Date();

        // Check expiry if it exists
        if (couponData.expiryDate && couponData.expiryDate.toDate() < now) {
            return { valid: false, message: 'Coupon has expired' };
        }

        return {
            valid: true,
            type: couponData.type, // 'percentage' or 'fixed'
            value: couponData.value,
            message: `Coupon applied: ${couponData.type === 'percentage' ? couponData.value + '%' : '₦' + couponData.value} off`
        };
    } catch (error) {
        console.error('Error validating coupon:', error);
        return { valid: false, message: 'Error validating coupon' };
    }
};
