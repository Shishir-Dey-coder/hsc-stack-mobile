
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {

  apiKey: "AIzaSyCbpry7Vdk5c6vEwEylAEYGgMHgHd0sJPc",

  authDomain: "chatapp-rgc-community.firebaseapp.com",

  projectId: "chatapp-rgc-community",

  storageBucket: "chatapp-rgc-community.firebasestorage.app",

  messagingSenderId: "345620021753",

  appId: "1:345620021753:web:c2f29830a76c2773fdfd28",

  measurementId: "G-SYXE6P2VWZ"

};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
