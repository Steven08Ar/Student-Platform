import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const StorageService = {
    /**
     * Uploads a profile image for a user
     * @param {string} userId 
     * @param {File} file 
     * @returns {Promise<string>} Download URL
     */
    async uploadProfileImage(userId, file) {
        try {
            // Create a reference to 'avatars/{userId}'
            // We use the same path to overwrite previous image, saving space
            const storageRef = ref(storage, `avatars/${userId}`);

            // Upload the file
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading profile image:", error);
            throw error;
        }
    }
};
