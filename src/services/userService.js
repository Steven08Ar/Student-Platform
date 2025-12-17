import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, orderBy, setDoc } from "firebase/firestore";

// Users
export const getUsersByRole = async (role) => {
    const q = query(collection(db, "users"), where("role", "==", role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create a Real Student Account (Auth + DB) using Secondary App pattern
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Need config again here or export it from firebase.js (better to just reconstruct or export)
// Assuming standard Vite env vars are available
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const createStudentAuthAccount = async (studentData, password) => {
    // 1. Initialize secondary app to avoid signing out the teacher
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    try {
        // 2. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, studentData.email, password);
        const user = userCredential.user;

        // 3. Update Profile (Name)
        await updateProfile(user, {
            displayName: studentData.name
        });

        // 4. Create Firestore Document (using main DB instance)
        await setDoc(doc(db, "users", user.uid), {
            ...studentData,
            uid: user.uid,
            role: 'student',
            createdAt: new Date().toISOString()
        });

        return user;
    } catch (error) {
        throw error;
    } finally {
        // 5. Cleanup
        await deleteApp(secondaryApp);
    }
};

export const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    // Note: Deleting from Auth requires Admin SDK or Cloud Functions, client cannot delete other users' Auth.
    // We just remove access by deleting DB record (login check should fail or we rely on DB role).
};
