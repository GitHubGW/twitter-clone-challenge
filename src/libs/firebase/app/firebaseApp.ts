import firebaseConfig from "../configs/firebaseConfig";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
