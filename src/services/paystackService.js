// Paystack Payment Service
// Documentation: https://paystack.com/docs/api/

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

/**
 * Initialize Paystack transaction
 * @param {Object} params - Transaction parameters
 * @param {string} params.email - Customer email
 * @param {number} params.amount - Amount in Naira (will be converted to kobo)
 * @param {string} params.reference - Unique transaction reference
 * @param {Object} params.metadata - Additional metadata
 * @returns {Promise<Object>} - Paystack response
 */
export const initializePaystackTransaction = async ({ email, amount, reference, metadata }) => {
    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Convert to kobo
                reference,
                metadata,
                channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
            })
        });

        const result = await response.json();

        if (result.status) {
            console.log('✅ Paystack transaction initialized:', result.data);
            return {
                success: true,
                data: result.data,
                authorizationUrl: result.data.authorization_url,
                accessCode: result.data.access_code,
                reference: result.data.reference
            };
        } else {
            console.error('❌ Failed to initialize Paystack transaction:', result);
            return { success: false, error: result.message || 'Failed to initialize payment' };
        }
    } catch (error) {
        console.error('❌ Error initializing Paystack transaction:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Verify Paystack transaction (SERVER-SIDE ONLY)
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} - Verification result
 */
export const verifyPaystackTransaction = async (reference) => {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status && result.data.status === 'success') {
            console.log('✅ Payment verified successfully:', result.data);
            return {
                success: true,
                data: result.data,
                amount: result.data.amount / 100, // Convert from kobo to Naira
                paidAt: result.data.paid_at,
                channel: result.data.channel,
                reference: result.data.reference
            };
        } else {
            console.error('❌ Payment verification failed:', result);
            return {
                success: false,
                error: result.message || 'Payment verification failed',
                status: result.data?.status
            };
        }
    } catch (error) {
        console.error('❌ Error verifying Paystack transaction:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get Paystack public key for frontend integration
 * @returns {string} - Public key
 */
export const getPaystackPublicKey = () => {
    return PAYSTACK_PUBLIC_KEY;
};

/**
 * Generate unique transaction reference
 * @param {string} orderNumber - Order number
 * @returns {string} - Unique reference
 */
export const generatePaystackReference = (orderNumber) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${orderNumber}-${timestamp}-${random}`;
};
