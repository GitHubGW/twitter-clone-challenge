"use client";

import { firebaseAuth, firebaseStore } from "@/libs/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { Post } from "@/app/_components/post";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/app/_components/loading-spinner";

interface Post {
  id: string;
  email: string;
  userId: string;
  textarea: string;
  imageUrl?: string;
  createdAt: number;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleAuthStateReady = async () => {
    await firebaseAuth.authStateReady();
    setIsLoading(false);
  };

  const getPosts = () => {
    const collectionReference = collection(firebaseStore, "posts");
    const queryData = query(collectionReference, orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(queryData, (querySnapshot) => {
      const documentDataArray = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          email: doc.data().email,
          userId: doc.data().userId,
          textarea: doc.data().textarea,
          imageUrl: doc.data()?.imageUrl,
          createdAt: doc.data().createdAt,
        };
      });
      setPosts(documentDataArray);
    });
    return unsubscribe;
  };

  useEffect(() => {
    handleAuthStateReady();
  }, []);

  useEffect(() => {
    const unsubscribe = getPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center flex-col">
      {posts.map((post) => (
        <Post key={post.id} id={post.id} email={post.email} textarea={post.textarea} imageUrl={post.imageUrl} createdAt={post.createdAt} />
      ))}
    </div>
  );
};

export default Home;
