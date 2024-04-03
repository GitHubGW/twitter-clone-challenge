import firebaseApp from "./firebaseApp";
import { getAuth } from "firebase/auth";

const firebaseAuth = getAuth(firebaseApp);

export default firebaseAuth;
