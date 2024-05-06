// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOz0KpcdCgGv8jCeB7XlzhVO0mcXkT3-g",
    authDomain: "thoughtify-79e59.firebaseapp.com",
    projectId: "thoughtify-79e59",
    storageBucket: "thoughtify-79e59.appspot.com",
    messagingSenderId: "402495938360",
    appId: "1:402495938360:web:fed742077a6ffb8411abcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)