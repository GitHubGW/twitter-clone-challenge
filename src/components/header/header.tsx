"use client";

import ROUTES from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { firebaseAuth } from "@/libs/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { user } = useUser();

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
      <Link href={ROUTES.HOME}>
        <Image src="/icons/ic_reddit.svg" alt="Reddit Logo" width={90} height={90} className="cursor-pointer" />
      </Link>
      <div className="flex items-center gap-8">
        {user && (
          <div className="flex items-center gap-7">
            <Link href={ROUTES.SUBMIT}>
              <Image src="/icons/ic_pencil.svg" alt="Pencil Icon" width={30} height={30} className="cursor-pointer" />
            </Link>
            <Link href={ROUTES.USER_DETAIL(user?.uid)}>
              <Image src={user.photoURL || "/icons/ic_user.svg"} alt="User Icon" width={30} height={30} className="cursor-pointer" />
            </Link>
          </div>
        )}
        {user ? (
          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <Link href={ROUTES.LOGIN}>
            <button type="button">Go to Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
