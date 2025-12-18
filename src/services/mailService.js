import { db } from "./firebase";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp,
    getDocs
} from "firebase/firestore";

export const MailService = {
    /**
     * Send a new message
     * @param {string} senderId 
     * @param {string} receiverId 
     * @param {string} subject 
     * @param {string} content 
     * @param {string} senderName 
     * @param {string} receiverName 
     */
    async sendMessage(senderId, receiverId, subject, content, senderName, receiverName, senderAvatar = null, receiverAvatar = null) {
        try {
            await addDoc(collection(db, "messages"), {
                senderId,
                receiverId,
                subject,
                content,
                senderName,
                receiverName,
                senderAvatar,
                receiverAvatar,
                createdAt: serverTimestamp(),
                read: false
            });
            return { success: true };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    /**
     * Subscribe to incoming messages (Inbox)
     * @param {string} userId 
     * @param {function} callback 
     * @returns {function} unsubscribe
     */
    subscribeToInbox(userId, callback) {
        const q = query(
            collection(db, "messages"),
            where("receiverId", "==", userId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    /**
     * Subscribe to sent messages (Sent)
     * @param {string} userId 
     * @param {function} callback 
     * @returns {function} unsubscribe
     */
    subscribeToSent(userId, callback) {
        const q = query(
            collection(db, "messages"),
            where("senderId", "==", userId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    /**
     * Mark a message as read
     * @param {string} messageId 
     */
    async markAsRead(messageId) {
        try {
            const msgRef = doc(db, "messages", messageId);
            await updateDoc(msgRef, {
                read: true
            });
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    },

    /**
     * Get count of unread messages
     * @param {string} userId 
     * @param {function} callback 
     * @returns {function} unsubscribe
     */
    subscribeToUnreadCount(userId, callback) {
        const q = query(
            collection(db, "messages"),
            where("receiverId", "==", userId),
            where("read", "==", false)
        );

        return onSnapshot(q, (snapshot) => {
            callback(snapshot.size);
        });
    },

    /**
     * Get list of potential recipients based on current user role
     * @param {string} role 'teacher' or 'student'
     */
    async getRecipients(role) {
        // If current user is teacher, get students. If student, get teachers.
        const targetRole = role === 'teacher' ? 'student' : 'teacher';

        const q = query(
            collection(db, "users"),
            where("role", "==", targetRole)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
};
