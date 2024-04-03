import { initializeApp } from "firebase/app";
import firebaseConfig from "../configs/firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
