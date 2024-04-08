"use client";

import ROUTES from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { firebaseStorage } from "@/libs/firebase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  file: FileList | null;
}

const UserCard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: { file: null },
  });

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList && fileList.length > 0) {
      setValue("file", fileList);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(fileList[0]);

      const handleLoadFileReader = () => {
        const dataUrl = fileReader.result;
        setAvatarUrl(dataUrl as string);
      };

      fileReader.onload = handleLoadFileReader;
    }
  };

  const handleUploadImage = async (formData: FormData) => {
    try {
      const fileList = formData.file;
      if (fileList && fileList.length > 0) {
        const storageReference = ref(firebaseStorage, `avatars/${user?.email}/${user?.uid}`);
        const uploadResult = await uploadBytes(storageReference, fileList[0]);
        const uploadResultStorageReference = uploadResult.ref;
        const downloadUrl = await getDownloadURL(uploadResultStorageReference);
        return downloadUrl;
      }
    } catch (error) {
      console.log("handleUploadImage error", error);
    }
  };

  const handleSubmitForm: SubmitHandler<FormData> = async (formData) => {
    if (!user) {
      return;
    }

    const downloadUrl = await handleUploadImage(formData);
    await updateProfile(user, { photoURL: downloadUrl || user?.photoURL });
    router.push(ROUTES.HOME);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="border-2 border-gray-300 py-8 px-10 rounded-lg">
      <div className="mb-6 flex justify-center">
        <label htmlFor="file" className="cursor-pointer relative">
          <Image src={avatarUrl || "/icons/ic_user.svg"} width={100} height={100} alt="" />
          <span className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center rounded-full bg-gray-300 bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Image src={"/icons/ic_upload.svg"} width={40} height={40} alt="" />
          </span>
        </label>
        <input {...(register("file"), { onChange: handleChangeFile })} type="file" id="file" name="file" className="hidden" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg">User ID: {user?.uid}</p>
        <p className="text-lg">Email: {user?.email}</p>
        <p className="text-lg">Display Name: {user?.displayName}</p>
      </div>
      <input type="submit" value="프로필 업데이트하기" className="bg-blue-500 w-full text-white px-4 py-3 rounded-lg hover:bg-blue-600 mt-6 cursor-pointer" />
    </form>
  );
};

export default UserCard;
