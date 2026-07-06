import { initializeApp } from "firebase/app";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInAnonymously,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const defaultDb = getFirestore(app);
export const customDb = getFirestore(app, firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)" ? firebaseConfig.firestoreDatabaseId : undefined);

// Export a mutable reference container so we can fall back dynamically
export const dbContainer = {
  activeDb: customDb
};

// Try to enable offline persistence for both DB instances for robust offline support
try {
  enableIndexedDbPersistence(defaultDb).catch((err) => {
    console.warn("Firestore offline persistence failed for defaultDb:", err.code);
  });
  enableIndexedDbPersistence(customDb).catch((err) => {
    console.warn("Firestore offline persistence failed for customDb:", err.code);
  });
} catch (e) {
  console.warn("Firestore persistence initialization error:", e);
}

// Export db as a Proxy that forwards calls to the active db
export const db = new Proxy({}, {
  get(target, prop, receiver) {
    return Reflect.get(dbContainer.activeDb, prop, receiver);
  },
  getPrototypeOf(target) {
    return Object.getPrototypeOf(dbContainer.activeDb);
  },
  set(target, prop, value, receiver) {
    return Reflect.set(dbContainer.activeDb, prop, value, receiver);
  }
}) as Firestore;

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInAnonymously,
  sendPasswordResetEmail,
  sendEmailVerification
};
