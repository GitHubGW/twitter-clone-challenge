"use client";

import { firebaseStore } from "@/libs/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { Post } from "../post";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  email: string;
  userId: string;
  textarea: string;
  imageUrl?: string;
  createdAt: number;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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
    const unsubscribe = getPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="border-blue-500 border-2 flex items-center flex-col">
      {posts.map((post) => (
        <Post key={post.id} id={post.id} email={post.email} textarea={post.textarea} imageUrl={post.imageUrl} createdAt={post.createdAt} />
      ))}
    </div>
  );
};

export default Home;
