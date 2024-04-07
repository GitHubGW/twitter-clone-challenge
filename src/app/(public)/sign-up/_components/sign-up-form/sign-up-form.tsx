"use client";

import { GithubButton } from "@/components/github-button";
import ROUTES from "@/constants/routes";
import { firebaseAuth } from "@/libs/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });

  const handleSubmitForm: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      clearErrors();
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(userCredential.user, { displayName: email });
      router.push(ROUTES.HOME);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError("root", { type: "", message: error.message });
        return;
      } else {
        console.log("SignUpForm handleSubmitForm error", error);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="rounded-md bg-gray-100 border-2 w-1/3 h-2/5 flex flex-col items-center justify-center px-12 gap-y-3">
        <div className="font-bold text-3xl">회원가입</div>
        <input {...register("email", { required: true })} type="email" placeholder="Email" className="border-gray-200 border-2 rounded-md w-full py-3 px-3" />
        <input {...register("password", { required: true })} type="password" placeholder="Password" className="border-gray-200 border-2 rounded-md w-full py-3 px-3" />
        <input type="submit" value="Sign Up" className="bg-slate-500 hover:bg-slate-600 text-white rounded-md w-full py-3 px-3 cursor-pointer" />
        <GithubButton />
        <Link href={ROUTES.LOGIN} className="underline text-blue-500">
          Go to Log In
        </Link>
        <Link href={ROUTES.RESET_PASSWORD} className="underline text-blue-500">
          Go to Reset Password
        </Link>
        <div className="text-red-500 text-sm">{errors.root?.message}</div>
      </form>
    </div>
  );
};

export default SignUpForm;
