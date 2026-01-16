import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: "AIzaSyC5k4djXU2NDATXWv0ru6yvlrmRegpAvQQ", 
  authDomain: "semester-survival.firebaseapp.com", 
  projectId: "semester-survival",
  storageBucket: "semester-survival.firebasestorage.app", 
  messagingSenderId: "37295109708", 
  appId: "1:37295109708:web:1b3d853bdee94216d6a6e9", 
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase инициализирован успешно");
  } catch (error) {
    console.error("Ошибка инициализации Firebase:", error);
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { app, db };
export default { app, db };

