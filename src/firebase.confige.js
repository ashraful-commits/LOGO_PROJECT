//==================== Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//==================== Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqjjCnmUy4Z5geanyTcjirXsorjqKNmQY",
  authDomain: "logo-2150e.firebaseapp.com",
  projectId: "logo-2150e",
  storageBucket: "logo-2150e.appspot.com",
  messagingSenderId: "561894259671",
  appId: "1:561894259671:web:bb25551ff0d5a919662992"
};

//==================== Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}