import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './Firebase';

// Add new address
export const addAddress = async (userId, addressData) => {
  try {
    const addressRef = collection(db, 'users', userId, 'addresses');
    
    // If this is set as default, unset other defaults first
    if (addressData.isDefault) {
      const snapshot = await getDocs(addressRef);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { isDefault: false })
      );
      await Promise.all(updatePromises);
    }
    
    await addDoc(addressRef, {
      label: addressData.label,
      name: addressData.name,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      phone: addressData.phone,
      isDefault: addressData.isDefault || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Address added successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all user addresses
export const getUserAddresses = async (userId) => {
  try {
    const addressRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressRef);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

// Update address
export const updateAddress = async (userId, addressId, updatedData) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    
    // If setting as default, unset other defaults first
    if (updatedData.isDefault) {
      const allAddressesRef = collection(db, 'users', userId, 'addresses');
      const snapshot = await getDocs(allAddressesRef);
      const updatePromises = snapshot.docs
        .filter(doc => doc.id !== addressId)
        .map(doc => updateDoc(doc.ref, { isDefault: false }));
      await Promise.all(updatePromises);
    }
    
    await updateDoc(addressRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete address
export const deleteAddress = async (userId, addressId) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
    return { success: true, message: 'Address deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
  try {
    // Unset all defaults
    const addressRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressRef);
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { isDefault: false })
    );
    await Promise.all(updatePromises);
    
    // Set the selected address as default
    const selectedAddressRef = doc(db, 'users', userId, 'addresses', addressId);
    await updateDoc(selectedAddressRef, { 
      isDefault: true,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Default address updated' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};