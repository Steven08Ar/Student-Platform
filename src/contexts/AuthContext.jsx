import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Fetch user role and data from Firestore
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, name, role, gender = "prefer-not-to-say") => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Generate avatar based on gender
        let avatarUrl;
        if (gender === "male") {
            avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&gender=male`;
        } else if (gender === "female") {
            avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&gender=female`;
        } else {
            avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        }

        // Create user document in Firestore with role and avatar
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            role, // 'teacher' or 'student'
            gender,
            avatarUrl,
            createdAt: new Date().toISOString()
        });
        return user;
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateProfileImage = async (url) => {
        if (!user) return;

        // Update Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            avatarUrl: url
        });

        // Update local state
        setUserData(prev => ({ ...prev, avatarUrl: url }));
    };

    const value = {
        user,
        userData,
        loading,
        login,
        register,
        logout,
        updateProfileImage
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
