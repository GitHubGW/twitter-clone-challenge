"use client";

import { PostDetail } from "@/app/(private)/posts/[postId]/_components/post-detail";
import { firebaseStore } from "@/libs/firebase";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface PostDetailPageProps {
  params: { postId: string };
}

const PostDetailPage = ({ params }: PostDetailPageProps) => {
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

  return <PostDetail id={params.postId} userId={post.userId} email={post.email} textarea={post.textarea} imageUrl={post.imageUrl} createdAt={post.createdAt} />;
};

export default PostDetailPage;
