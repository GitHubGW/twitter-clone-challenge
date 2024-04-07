import firebaseApp from "./firebaseApp";
import { getStorage } from "firebase/storage";

const firebaseStorage = getStorage(firebaseApp);

export default firebaseStorage;
