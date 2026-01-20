import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword as firebaseUpdatePassword,
    updateProfile,
    verifyPasswordResetCode,
    confirmPasswordReset
} from 'firebase/auth';
import { auth } from './firebaseConfig';

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, {
            displayName: name
        });

        // Send verification email
        await sendEmailVerification(user);

        return {
            success: true,
            user: user
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return {
            success: true,
            user: result.user
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Sign in with Facebook
 */
export const signInWithFacebook = async () => {
    try {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return {
            success: true,
            user: result.user
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            user: userCredential.user
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

export const loginWithEmail = signInWithEmail;

/**
 * Sign out
 */
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Reset password
 */
export const resetPasswordForEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Update password
 */
export const updatePassword = async (newPassword) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        await firebaseUpdatePassword(user, newPassword);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Verify email status
 */
export const verifyEmail = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, verified: false };

    await user.reload();
    return {
        success: true,
        verified: user.emailVerified,
        user: user
    };
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        await sendEmailVerification(user);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message,
            error: error
        };
    }
};

/**
 * Verify password reset code (oobCode)
 */
export const verifyResetCode = async (code) => {
    try {
        await verifyPasswordResetCode(auth, code);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message
        };
    }
};

/**
 * Confirm password reset with code and new password
 */
export const confirmNewPassword = async (code, newPassword) => {
    try {
        await confirmPasswordReset(auth, code, newPassword);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            code: error.code,
            message: error.message
        };
    }
};

/**
 * Friendly error messages
 */
export const getErrorMessage = (code) => {
    const errorMessages = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password must be at least 6 characters long',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
    };

    return errorMessages[code] || 'An error occurred. Please try again.';
};
