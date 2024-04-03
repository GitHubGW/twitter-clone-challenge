import { firebaseAuth } from "@/libs/firebase";

const useUser = () => {
  const user = firebaseAuth.currentUser;
  return { user };
};

export default useUser;
