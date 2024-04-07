"use client";

import ROUTES from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { firebaseStorage, firebaseStore } from "@/libs/firebase";
import { DocumentData, DocumentReference, addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  textarea: string;
  file: FileList | null;
}

const SubmitForm = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { textarea: "", file: null },
  });

  const handleCreatePost = async (formData: FormData) => {
    try {
      const collectionReference = collection(firebaseStore, "posts");
      const postData = { textarea: formData.textarea, userId: user?.uid, email: user?.email, createdAt: Date.now() };
      const documentReference = await addDoc(collectionReference, postData);
      return documentReference;
    } catch (error) {
      console.log("handleCreatePost error", error);
    }
  };

  const handleUploadImage = async (formData: FormData, documentReference: DocumentReference<DocumentData, DocumentData>) => {
    try {
      const fileList = formData.file;
      if (fileList && fileList.length > 0 && documentReference) {
        const storageReference = ref(firebaseStorage, `posts/${user?.email}/${documentReference.id}`);
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

    const documentReference = await handleCreatePost(formData);
    if (!documentReference) {
      return;
    }

    const downloadUrl = await handleUploadImage(formData, documentReference);
    await updateDoc(documentReference, { imageUrl: downloadUrl || "" });
    router.push(ROUTES.HOME);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="max-[768px] rounded-md bg-gray-100 border-2 w-2/4 h-3/5 flex flex-col items-center justify-center px-12 gap-y-3">
        <div className="font-bold text-3xl">포스트 작성</div>
        <textarea
          {...register("textarea", { required: true, maxLength: 200 })}
          placeholder="What is happening?"
          className="resize-none border-gray-200 border-2 rounded-md w-full h-2/5 py-3 px-3"
        />
        {errors.textarea && <div className="text-red-500 text-sm">Textarea field is required</div>}
        <label htmlFor="file" className="text-lg cursor-pointer border-gray-200 border-2 w-full text-center bg-gray-900 text-white px-2 py-3 rounded-md">
          {Number(watch("file")?.length) > 0 ? watch("file")?.[0].name : "이미지 업로드"}
        </label>
        <input {...register("file")} type="file" id="file" name="file" className="hidden border-gray-200 border-2 rounded-md w-full py-3 px-3" />
        <input type="submit" value="작성하기" className="bg-slate-500 hover:bg-slate-600 text-white rounded-md w-full py-3 px-3 cursor-pointer" />
        <div className="text-red-500 text-sm">{errors.root?.message}</div>
      </form>
    </div>
  );
};

export default SubmitForm;
