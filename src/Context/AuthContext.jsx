import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContextCore';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {
    signInWithEmail,
    signUpWithEmail as firebaseSignUp,
    signInWithGoogle as firebaseGoogle,
    signInWithFacebook as firebaseFacebook,
    signOut,
    verifyEmail,
    resendVerificationEmail
} from '../firebase/auth';
import { getUserProfile, updateUserProfile } from '../firebase/userProfileServices';
import { serverTimestamp } from 'firebase/firestore';
import LoadingSpinner from '../Components/common/LoadingSpinner';


export const AuthProvider = ({ children }) => {
    console.log('🔵 AuthProvider initializing (Firebase)...');
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const processProfile = (data) => {
        if (!data) return null;
        const isComplete = !!(data.firstName && data.lastName && data.gender && data.dateOfBirth && data.phone);
        return {
            ...data,
            isComplete
        };
    };

    const fetchProfile = async (userId) => {
        if (!userId) {
            setUserProfile(null);
            return;
        }
        const result = await getUserProfile(userId);
        if (result.success) {
            setUserProfile(processProfile(result.data));
        }
    };

    useEffect(() => {
        let isMounted = true;
        console.log('🟢 AuthProvider useEffect running');

        // Listen for auth changes using Firebase
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('🔥 onAuthStateChanged triggered:', user ? 'User ID: ' + user.uid : 'No user');
            if (!isMounted) {
                console.log('⚠️ onAuthStateChanged fired after unmount');
                return;
            }

            console.log('🔥 Firebase Auth State Change:', user ? 'Logged In' : 'Logged Out');
            setCurrentUser(user);

            if (user) {
                try {
                    // Check if profile exists
                    const profileResult = await getUserProfile(user.uid);

                    // If no profile exists, create one from metadata
                    if (!profileResult.success || !profileResult.data) {
                        const [firstName, ...lastNameParts] = (user.displayName || '').split(' ');
                        const lastName = lastNameParts.join(' ') || '';

                        await updateUserProfile(user.uid, {
                            firstName: firstName || '',
                            lastName: lastName || '',
                            email: user.email || '',
                            photoURL: user.photoURL || '',
                            authProvider: user.providerData[0]?.providerId || 'password',
                            createdAt: serverTimestamp(),
                            // Initialize subcollections structure (conceptual, Firestore handles these auto)
                        });
                    }

                    // Set processed profile
                    const finalProfile = await getUserProfile(user.uid);
                    if (finalProfile.success) {
                        setUserProfile(processProfile(finalProfile.data));
                    }
                } catch (error) {
                    console.error('❌ Profile sync error:', error);
                }
            } else {
                console.log('👤 No user logged in, clearing profile');
                setUserProfile(null);
            }

            console.log('🏁 Setting loading to false');
            setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        return await signInWithEmail(email, password);
    };

    const signup = async (email, password, name, extraData = {}) => {
        const result = await firebaseSignUp(email, password, name);
        if (result.success && result.user) {
            // Create user profile
            await updateUserProfile(result.user.uid, {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || '',
                email: email,
                authProvider: 'password',
                createdAt: serverTimestamp(),
                ...extraData
            });
            await fetchProfile(result.user.uid);
        }
        return result;
    };

    const loginWithGoogle = async () => {
        return await firebaseGoogle();
    };

    const loginWithFacebook = async () => {
        return await firebaseFacebook();
    };

    const logout = async () => {
        console.log('🔴 AuthContext: Starting Firebase logout process...');

        try {
            const result = await signOut();

            if (!result.success) {
                console.error('⚠️ AuthContext: Logout error from Firebase:', result.error);
            }
        } catch (error) {
            console.error('❌ AuthContext: Logout exception:', error);
        } finally {
            setCurrentUser(null);
            setUserProfile(null);
            console.log('✅ AuthContext: Logout complete');
        }
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        verifyEmail,
        resendVerificationEmail,
        refreshProfile: () => fetchProfile(currentUser?.uid)
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider>
    );
};

