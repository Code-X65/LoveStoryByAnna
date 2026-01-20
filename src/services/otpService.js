import CryptoJS from 'crypto-js';

/**
 * Generate a secure 6-digit OTP
 * @returns {string} - 6-digit OTP code
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP using SHA-256
 * @param {string} otp - Plain OTP code
 * @returns {string} - Hashed OTP
 */
export const hashOTP = (otp) => {
    return CryptoJS.SHA256(otp).toString();
};

/**
 * Verify OTP against stored hash
 * @param {string} inputOTP - OTP entered by user
 * @param {string} storedHash - Stored hashed OTP
 * @returns {boolean} - True if OTP matches
 */
export const verifyOTP = (inputOTP, storedHash) => {
    const inputHash = hashOTP(inputOTP);
    return inputHash === storedHash;
};

/**
 * Check if OTP has expired
 * @param {Date|Timestamp} expiryTime - OTP expiry timestamp
 * @returns {boolean} - True if expired
 */
export const isOTPExpired = (expiryTime) => {
    const now = new Date();
    const expiry = expiryTime instanceof Date ? expiryTime : expiryTime.toDate();
    return now > expiry;
};

/**
 * Get OTP expiry time (48 hours from now)
 * @returns {Date} - Expiry timestamp
 */
export const getOTPExpiryTime = () => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 48); // 48 hours validity
    return expiry;
};
