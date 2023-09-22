// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCD7WDwAtByzkN1NcPamVJPc4m--ARO0Y",
  authDomain: "flipkartclone-1205f.firebaseapp.com",
  projectId: "flipkartclone-1205f",
  storageBucket: "flipkartclone-1205f.appspot.com",
  messagingSenderId: "225019299749",
  appId: "1:225019299749:web:cf4e2ceb47238a3632ca4c",
  measurementId: "G-M7END3H9CX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

