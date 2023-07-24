// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMgFhzfyqF15cjMDOFZDrcqUFO5xDfSvE",
  authDomain: "fir-app-1db24.firebaseapp.com",
  databaseURL: "https://fir-app-1db24-default-rtdb.firebaseio.com",
  projectId: "fir-app-1db24",
  storageBucket: "fir-app-1db24.appspot.com",
  messagingSenderId: "681559148778",
  appId: "1:681559148778:web:244e05d409f5c3c4c0af93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
export {
  database,
  auth,
}
