import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

export const ContentService = {
    // --- Banners ---
    getBanners: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "banners"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },

    addBanner: async (bannerData) => {
        try {
            const docRef = await addDoc(collection(db, "banners"), bannerData);
            return { id: docRef.id, ...bannerData };
        } catch (error) {
            console.error("Error adding banner:", error);
            throw error;
        }
    },

    deleteBanner: async (id) => {
        try {
            await deleteDoc(doc(db, "banners", id));
            return true;
        } catch (error) {
            console.error("Error deleting banner:", error);
            throw error;
        }
    },

    // --- Combos ---
    getCombos: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "combos"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching combos:", error);
            return [];
        }
    },

    addCombo: async (comboData) => {
        try {
            const docRef = await addDoc(collection(db, "combos"), comboData);
            return { id: docRef.id, ...comboData };
        } catch (error) {
            console.error("Error adding combo:", error);
            throw error;
        }
    },

    updateCombo: async (id, comboData) => {
        try {
            await setDoc(doc(db, "combos", id), comboData, { merge: true });
            return { id, ...comboData };
        } catch (error) {
            console.error("Error updating combo:", error);
            throw error;
        }
    },

    deleteCombo: async (id) => {
        try {
            await deleteDoc(doc(db, "combos", id));
            return true;
        } catch (error) {
            console.error("Error deleting combo:", error);
            throw error;
        }
    },

    // --- Flyers ---
    getFlyers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "flyers"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching flyers:", error);
            return [];
        }
    },

    addFlyer: async (flyerData) => {
        try {
            const docRef = await addDoc(collection(db, "flyers"), flyerData);
            return { id: docRef.id, ...flyerData };
        } catch (error) {
            console.error("Error adding flyer:", error);
            throw error;
        }
    },

    deleteFlyer: async (id) => {
        try {
            await deleteDoc(doc(db, "flyers", id));
            return true;
        } catch (error) {
            console.error("Error deleting flyer:", error);
            throw error;
        }
    },

    // --- Settings (General) ---
    getSettings: async () => {
        try {
            const docRef = doc(db, "settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            return null;
        }
    },

    saveSettings: async (settingsData) => {
        try {
            await setDoc(doc(db, "settings", "general"), settingsData, { merge: true });
            return true;
        } catch (error) {
            console.error("Error saving settings:", error);
            throw error;
        }
    }
};
