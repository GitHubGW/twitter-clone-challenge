"use client";

import "dayjs/locale/ko";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { DocumentData, DocumentReference, doc, updateDoc } from "firebase/firestore";
import { firebaseStorage, firebaseStore } from "@/libs/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useState } from "react";
import ROUTES from "@/constants/routes";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface PostEditFormProps {
  id: string;
  userId: string;
  email: string;
  textarea: string;
  imageUrl?: string;
}

interface FormData {
  textarea: string;
  file: FileList | null;
}

const PostEditForm = ({ id, userId, email, textarea, imageUrl = "" }: PostEditFormProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(imageUrl);
  const isMe = user?.uid === userId;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { textarea, file: null },
  });

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList && fileList.length > 0) {
      setValue("file", fileList);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(fileList[0]);

      const handleLoadFileReader = () => {
        const dataUrl = fileReader.result;
        setUploadedImageUrl(dataUrl as string);
      };

      fileReader.onload = handleLoadFileReader;
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
    const documentReference = doc(firebaseStore, "posts", id);
    const downloadUrl = await handleUploadImage(formData, documentReference);
    await updateDoc(documentReference, { textarea: formData.textarea, imageUrl: downloadUrl || imageUrl });
    router.push(ROUTES.POST_DETAIL(id));
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="max-[768px] rounded-md bg-gray-100 border-2 w-2/4 h-3/5 flex flex-col items-center justify-center px-12 gap-y-3">
        <div className="font-bold text-3xl">포스트 수정</div>
        <textarea
          {...register("textarea", { required: true, maxLength: 200 })}
          placeholder="What is happening?"
          className="resize-none border-gray-200 border-2 rounded-md w-full h-2/5 py-3 px-3"
        />
        {errors.textarea && <div className="text-red-500 text-sm">Textarea field is required</div>}
        {uploadedImageUrl && <Image src={uploadedImageUrl} alt={email} width={200} height={200} />}
        {isMe && (
          <>
            <label htmlFor="file" className="text-lg cursor-pointer border-gray-200 border-2 w-full text-center bg-gray-900 text-white px-2 py-3 rounded-md">
              {Number(watch("file")?.length) > 0 ? watch("file")?.[0].name : "이미지 업로드"}
            </label>
            <input
              {...(register("file"), { onChange: handleChangeFile })}
              type="file"
              id="file"
              name="file"
              className="hidden border-gray-200 border-2 rounded-md w-full py-3 px-3"
            />
            <input type="submit" value="수정하기" className="bg-slate-500 hover:bg-slate-600 text-white rounded-md w-full py-3 px-3 cursor-pointer" />
          </>
        )}
        <div className="text-red-500 text-sm">{errors.root?.message}</div>
      </form>
    </div>
  );
};

export default PostEditForm;
