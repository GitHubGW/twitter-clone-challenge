"use client";

import ROUTES from "@/constants/routes";
import { firebaseAuth } from "@/libs/firebase";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await firebaseAuth.signOut();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="border-gray-300 border-b-2 w-full flex justify-between items-center px-4 py-4">
      <div>Logo</div>
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Header;
