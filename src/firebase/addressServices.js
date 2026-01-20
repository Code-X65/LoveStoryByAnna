import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp, writeBatch, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Helper to map Firestore doc to friendly address data
const mapAddress = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Ensure snake_case from DB is mapped to friendly names if needed
        firstName: data.firstName || data.first_name,
        lastName: data.lastName || data.last_name,
        addressLine: data.addressLine || data.address_line,
        zipCode: data.zipCode || data.zip_code,
        isDefault: data.isDefault !== undefined ? data.isDefault : data.is_default
    };
};

// Add new address
export const addAddress = async (userId, addressData) => {
    try {
        const addressRef = collection(db, 'users', userId, 'addresses');

        const isDefault = addressData.isDefault || addressData.is_default || false;

        // If this is set as default, unset other defaults first
        if (isDefault) {
            await unsetDefaults(userId);
        }

        const newAddress = {
            label: addressData.label || 'Home',
            firstName: addressData.firstName || addressData.first_name || '',
            lastName: addressData.lastName || addressData.last_name || '',
            email: addressData.email || '',
            phone: addressData.phone || '',
            addressLine: addressData.addressLine || addressData.address_line || addressData.address || '',
            city: addressData.city || '',
            state: addressData.state || '',
            zipCode: addressData.zipCode || addressData.zip_code || '',
            country: addressData.country || 'Nigeria',
            isDefault: isDefault,
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(addressRef, newAddress);
        return { success: true, data: { id: docRef.id, ...newAddress } };
    } catch (error) {
        console.error('Error adding address:', error);
        return { success: false, error: error.message };
    }
};

// Get user addresses
export const getUserAddresses = async (userId) => {
    try {
        const addressRef = collection(db, 'users', userId, 'addresses');
        const q = query(
            addressRef,
            orderBy('isDefault', 'desc') // Defaults first
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapAddress);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return [];
    }
};

// Update address
export const updateAddress = async (userId, addressId, updates) => {
    try {
        const docRef = doc(db, 'users', userId, 'addresses', addressId);

        const isDefaultUpdate = updates.isDefault || updates.is_default;

        if (isDefaultUpdate === true) {
            await unsetDefaults(userId);
        }

        const finalUpdates = { ...updates };
        // Normalize keys
        if (updates.firstName === undefined && updates.first_name) finalUpdates.firstName = updates.first_name;
        if (updates.lastName === undefined && updates.last_name) finalUpdates.lastName = updates.last_name;
        if (updates.addressLine === undefined && updates.address_line) finalUpdates.addressLine = updates.address_line;
        if (updates.isDefault === undefined && updates.is_default !== undefined) finalUpdates.isDefault = updates.is_default;

        await updateDoc(docRef, {
            ...finalUpdates,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating address:', error);
        return { success: false, error: error.message };
    }
};

// Delete address
export const deleteAddress = async (userId, addressId) => {
    try {
        const docRef = doc(db, 'users', userId, 'addresses', addressId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting address:', error);
        return { success: false, error: error.message };
    }
};

// Internal helper to unset all default addresses for a user
const unsetDefaults = async (userId) => {
    const addressRef = collection(db, 'users', userId, 'addresses');
    const q = query(addressRef, where('isDefault', '==', true));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.docs.forEach((d) => {
        batch.update(d.ref, { isDefault: false });
    });

    await batch.commit();
};

export const setDefaultAddress = async (userId, addressId) => {
    try {
        await unsetDefaults(userId);
        const docRef = doc(db, 'users', userId, 'addresses', addressId);
        await updateDoc(docRef, { isDefault: true });
        return { success: true };
    } catch (error) {
        console.error('Error setting default address:', error);
        return { success: false, error: error.message };
    }
};
