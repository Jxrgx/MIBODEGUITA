import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const appUser = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    role: 'client',
                    // Mark as initial until Firestore data arrives
                    _isInitial: true // Flag to prevent syncing this empty state to DB
                };

                // Hardcoded Admin Access
                if (appUser.email && appUser.email.toLowerCase() === 'alexanderdayanperazacasanova@gmail.com') {
                    appUser.role = 'admin';
                }

                setUser(appUser);
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Listen to real-time updates from Firestore
    useEffect(() => {
        if (user?.email) {
            import('firebase/firestore').then(({ doc, onSnapshot }) => {
                import('../firebase/config').then(({ db }) => {
                    const userRef = doc(db, 'users', user.email);
                    const unsubscribe = onSnapshot(userRef, (doc) => {
                        if (doc.exists()) {
                            const userData = doc.data();
                            isRemoteUpdate.current = true; // Mark as remote update
                            setUser(prev => {
                                const updatedUser = {
                                    ...prev,
                                    ...userData,
                                    role: userData.role || prev.role
                                };
                                // Remove _isInitial since we now have real data
                                delete updatedUser._isInitial;

                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                return updatedUser;
                            });
                        }
                    });
                    return () => unsubscribe();
                });
            });
        }
    }, [user?.email]);

    // Sync user to Firestore whenever it changes LOCALLY
    useEffect(() => {
        if (user) {
            // Don't sync if it's a remote update OR if it's the initial empty state
            if (isRemoteUpdate.current || user._isInitial) {
                isRemoteUpdate.current = false;
                return;
            }
            import('../services/users').then(({ UserService }) => {
                UserService.syncUser(user);
            });
        }
    }, [user]);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error logging in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const value = {
        user,
        setUser,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
}
