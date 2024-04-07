import firebaseApp from "./firebaseApp";
import { getFirestore } from "firebase/firestore";

const firebaseStore = getFirestore(firebaseApp);

export default firebaseStore;
