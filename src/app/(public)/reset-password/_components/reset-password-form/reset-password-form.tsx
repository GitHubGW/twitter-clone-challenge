"use client";

import ROUTES from "@/constants/routes";
import { firebaseAuth } from "@/libs/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm = () => {
  const [text, setText] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormProps>({
    defaultValues: { email: "" },
  });

  const handleSubmitForm: SubmitHandler<ResetPasswordFormProps> = async (formData) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, formData.email);
      setText("Password reset email sent");
    } catch (error) {
      console.log("ResetPasswordButton error", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="rounded-md bg-gray-100 border-2 w-1/3 h-2/5 flex flex-col items-center justify-center px-12 gap-y-3">
        <div className="font-bold text-3xl">비밀번호 재설정</div>
        <input {...register("email", { required: true })} type="email" placeholder="Email" className="border-gray-200 border-2 rounded-md w-full py-3 px-3" />
        <input type="submit" value="Send password reset email" className="bg-slate-500 hover:bg-slate-600 text-white rounded-md w-full py-3 px-3 cursor-pointer" />
        <Link href={ROUTES.LOGIN} className="underline text-blue-500">
          Go to Log In
        </Link>
        {text && <div className="text-green-500 text-sm">{text}</div>}
        <div className="text-red-500 text-sm">{errors.root?.message}</div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
