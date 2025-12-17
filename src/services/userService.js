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

// Create a Student "Profile" (Note: This doesn't create an Auth account, just a DB record for the directory)
// To fully create an account, the user would typically register, or an admin function would use Firebase Admin SDK
export const createStudentProfile = async (studentData) => {
    // We'll create a dummy ID or let Firestore generate one, but ideally this links to an Auth UID.
    // Since we are just "creating a profile" for the teacher's view:
    return await addDoc(collection(db, "users"), {
        ...studentData,
        role: 'student',
        createdAt: new Date().toISOString()
    });
};

export const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
};
