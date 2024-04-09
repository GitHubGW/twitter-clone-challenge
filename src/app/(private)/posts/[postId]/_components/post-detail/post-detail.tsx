"use client";

import "dayjs/locale/ko";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { deleteDoc, doc } from "firebase/firestore";
import { firebaseStorage, firebaseStore } from "@/libs/firebase";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import Link from "next/link";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface PostDetail {
  id: string;
  userId: string;
  email: string;
  textarea: string;
  imageUrl?: string;
  createdAt: number;
}

const PostDetail = ({ id, userId, email, textarea, imageUrl, createdAt }: PostDetail) => {
  const { user } = useUser();
  const router = useRouter();
  const isMe = user?.uid === userId;
  const fromNow = dayjs(createdAt).fromNow();

  const handleDeletePost = async () => {
    try {
      const documentReference = doc(firebaseStore, "posts", id);
      await deleteDoc(documentReference);
    } catch (error) {
      console.log("handleDeletePost error", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const storageReference = ref(firebaseStorage, `posts/${email}/${id}`);
      await deleteObject(storageReference);
    } catch (error) {
      console.log("handleDeleteImage error", error);
    }
  };

  const handleClickDeleteButton = async () => {
    const isOk = confirm("정말 삭제하시겠습니까?");

    if (!isMe || !isOk) {
      return;
    }

    await handleDeletePost();
    await handleDeleteImage();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-[768px] border-2 p-4 rounded-lg">
        <div className="text-2xl">
          <span className="font-semibold">{email}</span>
          <span className="ml-1 mr-1 text-gray-400">•</span>
          <span className="text-gray-600 text-lg">{fromNow}</span>
        </div>
        <div className="mt-2 mb-12 text-3xl break-words">{textarea}</div>
        {imageUrl && <Image src={imageUrl} width={150} height={150} alt="" className="mt-3" />}
        {isMe && (
          <div className="mt-10 flex items-center gap-3 justify-center">
            <Link href={ROUTES.POST_EDIT(id)} className="flex-1 text-center bg-blue-500 px-4 py-2.5 text-white rounded-lg hover:bg-blue-600">
              <button type="button">수정하기</button>
            </Link>
            <button onClick={handleClickDeleteButton} type="button" className="flex-1 bg-red-500 px-4 py-2.5 text-white rounded-lg hover:bg-red-600">
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
