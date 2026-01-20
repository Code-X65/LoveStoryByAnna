import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, serverTimestamp, writeBatch, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { generateOTP, hashOTP, verifyOTP, isOTPExpired, getOTPExpiryTime } from '../services/otpService';

/**
 * Create new order with OTP support
 * @param {string} userId - User ID
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} - Result object
 */
export const createOrder = async (userId, orderData) => {
    try {
        const {
            orderNumber,
            shippingAddress,
            items,
            total,
            subtotal,
            shippingCost,
            tax,
            paymentMethod,
            paymentStatus = 'pending',
            paymentReference = '',
            generateOTPCode = false // True for card/bank, false for COD
        } = orderData;

        const orderRef = collection(db, 'users', userId, 'orders');
        const rootOrderRef = doc(collection(db, 'orders'));
        const orderId = rootOrderRef.id;

        // Generate OTP if payment method is card or bank transfer
        let otpData = null;
        if (generateOTPCode) {
            const otp = generateOTP();
            const hashedOTP = hashOTP(otp);
            const expiryTime = getOTPExpiryTime();

            otpData = {
                otp_hash: hashedOTP,
                otp_expiry: Timestamp.fromDate(expiryTime),
                otp_status: 'unused',
                otp_plain: otp // Store temporarily for email sending, will be removed after email sent
            };
        }

        const newOrder = {
            id: orderId,
            userId,
            order_number: orderNumber,
            shipping_address: shippingAddress,
            total,
            subtotal,
            shipping_cost: shippingCost,
            tax,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            payment_reference: paymentReference,
            status: 'placed',
            requires_otp: generateOTPCode,
            ...(otpData && {
                otp_hash: otpData.otp_hash,
                otp_expiry: otpData.otp_expiry,
                otp_status: otpData.otp_status
            }),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const batch = writeBatch(db);

        // Write to user subcollection
        const userOrderRef = doc(db, 'users', userId, 'orders', orderId);
        batch.set(userOrderRef, newOrder);

        // Write to root collection for Admin
        batch.set(rootOrderRef, newOrder);

        // Add Order Items to both locations
        const userItemsRef = collection(db, 'users', userId, 'orders', orderId, 'items');
        const rootItemsRef = collection(db, 'orders', orderId, 'items');

        items.forEach(item => {
            const userItemDoc = doc(userItemsRef);
            const rootItemDoc = doc(rootItemsRef, userItemDoc.id);

            const itemData = {
                product_id: item.productId || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || 'N/A',
                color: item.color || 'N/A',
                image_url: item.image || ''
            };

            batch.set(userItemDoc, itemData);
            batch.set(rootItemDoc, itemData);
        });

        await batch.commit();

        return {
            success: true,
            orderId: orderId,
            orderNumber,
            otp: otpData?.otp_plain // Return plain OTP for email sending
        };
    } catch (error) {
        console.error('❌ Error creating order:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Verify OTP for order pickup/delivery
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @param {string} inputOTP - OTP entered by user/delivery personnel
 * @returns {Promise<Object>} - Verification result
 */
export const verifyOrderOTP = async (userId, orderId, inputOTP) => {
    try {
        const orderRef = doc(db, 'users', userId, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return { success: false, error: 'Order not found' };
        }

        const orderData = orderSnap.data();

        // Check if order requires OTP
        if (!orderData.requires_otp) {
            return { success: false, error: 'This order does not require OTP verification' };
        }

        // Check if OTP has already been used
        if (orderData.otp_status === 'used') {
            return { success: false, error: 'OTP has already been used' };
        }

        // Check if OTP has expired
        if (isOTPExpired(orderData.otp_expiry)) {
            return { success: false, error: 'OTP has expired' };
        }

        // Verify OTP
        const isValid = verifyOTP(inputOTP, orderData.otp_hash);

        if (!isValid) {
            return { success: false, error: 'Invalid OTP code' };
        }

        // Update OTP status to 'used'
        const batch = writeBatch(db);

        const userOrderRef = doc(db, 'users', userId, 'orders', orderId);
        const rootOrderRef = doc(db, 'orders', orderId);

        const updateData = {
            otp_status: 'used',
            otp_verified_at: serverTimestamp(),
            status: 'completed',
            updatedAt: serverTimestamp()
        };

        batch.update(userOrderRef, updateData);
        batch.update(rootOrderRef, updateData);

        await batch.commit();

        console.log('✅ OTP verified successfully for order:', orderId);
        return { success: true, message: 'OTP verified successfully. Order completed.' };
    } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update order payment status
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Result object
 */
export const updateOrderPaymentStatus = async (userId, orderId, paymentData) => {
    try {
        const { paymentStatus, paymentReference, paidAt } = paymentData;

        const batch = writeBatch(db);

        const userOrderRef = doc(db, 'users', userId, 'orders', orderId);
        const rootOrderRef = doc(db, 'orders', orderId);

        const updateData = {
            payment_status: paymentStatus,
            payment_reference: paymentReference,
            paid_at: paidAt ? Timestamp.fromDate(new Date(paidAt)) : serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        batch.update(userOrderRef, updateData);
        batch.update(rootOrderRef, updateData);

        await batch.commit();

        console.log('✅ Order payment status updated:', orderId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating payment status:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update order status
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Result object
 */
export const updateOrderStatus = async (userId, orderId, status) => {
    try {
        const batch = writeBatch(db);

        const userOrderRef = doc(db, 'users', userId, 'orders', orderId);
        const rootOrderRef = doc(db, 'orders', orderId);

        const updateData = {
            status,
            updatedAt: serverTimestamp()
        };

        batch.update(userOrderRef, updateData);
        batch.update(rootOrderRef, updateData);

        await batch.commit();

        console.log('✅ Order status updated:', orderId, status);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating order status:', error);
        return { success: false, error: error.message };
    }
};

// Get user orders with their items
export const getUserOrders = async (userId) => {
    try {
        const orderRef = collection(db, 'users', userId, 'orders');
        const q = query(
            orderRef,
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();

            // Fetch items for this order
            const itemsRef = collection(db, 'users', userId, 'orders', orderDoc.id, 'items');
            const itemsSnapshot = await getDocs(itemsRef);
            const items = itemsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            return {
                id: orderDoc.id,
                ...orderData,
                items: items,
                createdAt: orderData.createdAt?.toDate?.() || new Date(),
                otp_expiry: orderData.otp_expiry?.toDate?.() || null
            };
        }));

        return orders;
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        return [];
    }
};

/**
 * Get single order by ID
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object|null>} - Order data or null
 */
export const getOrderById = async (userId, orderId) => {
    try {
        const orderRef = doc(db, 'users', userId, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return null;
        }

        const orderData = orderSnap.data();

        // Fetch items
        const itemsRef = collection(db, 'users', userId, 'orders', orderId, 'items');
        const itemsSnapshot = await getDocs(itemsRef);
        const items = itemsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        return {
            id: orderSnap.id,
            ...orderData,
            items,
            createdAt: orderData.createdAt?.toDate?.() || new Date(),
            otp_expiry: orderData.otp_expiry?.toDate?.() || null
        };
    } catch (error) {
        console.error('❌ Error fetching order:', error);
        return null;
    }
};

