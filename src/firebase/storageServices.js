import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';

/**
 * Uploads a file to Firebase Storage
 * @param {File} file - The file object to upload
 * @param {string} path - The storage path (e.g., 'users/userId/profile.jpg')
 * @returns {Promise<string>} - The download URL
 */
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

/**
 * Deletes a file from Firebase Storage
 * @param {string} fileUrl - The full download URL of the file
 */
export const deleteFile = async (fileUrl) => {
    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
