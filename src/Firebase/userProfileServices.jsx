import { 
  collection,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './Firebase';

// Create user profile in Firestore
export const createUserProfile = async (userId, userData) => {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'info');
    await setDoc(profileRef, {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email,
      phone: userData.phone || '',
      dateOfBirth: userData.dateOfBirth || '',
      gender: userData.gender || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user profile
// In userProfileServices.js - REPLACE getUserProfile function:

// In userProfileServices.js - REPLACE getUserProfile function:


// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'info');
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return { success: true, data: profileSnap.data() };
    }
    
    // Return empty profile structure if not found
    return { 
      success: true, 
      data: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        displayName: '',
        photoURL: ''
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Update user profile
// In userProfileServices.js - REPLACE updateUserProfile function:

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'info');
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
      // Create profile if it doesn't exist
      await setDoc(profileRef, {
        ...updatedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing profile
      await updateDoc(profileRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
    }
    
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};