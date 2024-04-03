"use client";

import ROUTES from "@/constants/routes";
import { firebaseAuth } from "@/libs/firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GithubButton = () => {
  const router = useRouter();

  const handleClickGithubButton = async () => {
    try {
      const githubAuthProvider = new GithubAuthProvider();
      await signInWithPopup(firebaseAuth, githubAuthProvider);
      router.push(ROUTES.HOME);
    } catch (error) {
      console.log("GithubButton handleClickGithubButton error", error);
    }
  };

  return (
    <button onClick={handleClickGithubButton} type="button" className="py-3 rounded-md flex items-center w-full bg-slate-500 hover:bg-slate-600 text-white justify-center">
      <Image src="/icons/ic_github.svg" alt="Github Logo" width={24} height={24} />
      <span className="ml-2">Sign in with Github</span>
    </button>
  );
};

export default GithubButton;
