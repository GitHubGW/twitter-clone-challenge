"use client";

import { firebaseStore } from "@/libs/firebase";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { PostEditForm } from "./_components";
import { useCallback, useEffect, useState } from "react";

interface PostEditPageProps {
  params: { postId: string };
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const [post, setPost] = useState<DocumentData | undefined>(undefined);

  const getPost = useCallback(() => {
    const documentReference = doc(firebaseStore, "posts", params.postId);
    const unsubscribe = onSnapshot(documentReference, (documentSnapshot) => {
      const documentData = documentSnapshot.data();
      setPost(documentData);
    });
    return unsubscribe;
  }, [params.postId]);

  useEffect(() => {
    const unsubscribe = getPost();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getPost]);

  if (!post) {
    return null;
  }

  return <PostEditForm id={params.postId} userId={post.userId} email={post.email} textarea={post.textarea} imageUrl={post.imageUrl} />;
};

export default PostEditPage;
