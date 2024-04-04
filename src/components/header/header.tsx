"use client";

import ROUTES from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { firebaseAuth } from "@/libs/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleClickLogo = () => {
    router.push(ROUTES.HOME);
  };

  const handleSignOut = async () => {
    const isOk = confirm("Are you sure you want to sign out?");
    if (!isOk) {
      return;
    }
    await firebaseAuth.signOut();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="border-gray-300 border-b-2 w-full flex justify-between items-center px-4 py-4">
      <Image onClick={handleClickLogo} src="/icons/ic_reddit.svg" alt="Reddit Logo" width={90} height={90} className="cursor-pointer" />
      <div className="flex gap-8">
        <div>{user?.email}</div>
        <button type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
