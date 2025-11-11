import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './Firebase';


// Add this import at the top
import { createUserProfile } from './userProfileServices';

// Modify signUpWithEmail function - ADD after updateProfile:
export const signUpWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    // ADD THESE LINES:
    const [firstName, ...lastNameParts] = name.split(' ');
    await createUserProfile(userCredential.user.uid, {
      firstName: firstName,
      lastName: lastNameParts.join(' '),
      email: email,
      displayName: name,
      photoURL: userCredential.user.photoURL || ''
    });
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Modify signInWithGoogle - ADD after the result:
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    
    // ADD THESE LINES:
    const [firstName, ...lastNameParts] = (result.user.displayName || '').split(' ');
    await createUserProfile(result.user.uid, {
      firstName: firstName,
      lastName: lastNameParts.join(' '),
      email: result.user.email,
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || ''
    });
    
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Modify signInWithFacebook - ADD after the result:
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    
    // ADD THESE LINES:
    const [firstName, ...lastNameParts] = (result.user.displayName || '').split(' ');
    await createUserProfile(result.user.uid, {
      firstName: firstName,
      lastName: lastNameParts.join(' '),
      email: result.user.email,
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || ''
    });
    
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};



// Login with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};




// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get error message
export const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed.';
    default:
      return 'An error occurred. Please try again.';
  }
};