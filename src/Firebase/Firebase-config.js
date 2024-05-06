
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import conf from "../conf/conf";

const firebaseConfig = {
    apiKey: conf.firebaseApiKey,
    authDomain: conf.firebaseAuthDomain,
    projectId: conf.firebaseProjectID,
    storageBucket: conf.firebaseStorageBucketID,
    messagingSenderId: conf.firebaseMsgSenderID,
    appId: conf.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)