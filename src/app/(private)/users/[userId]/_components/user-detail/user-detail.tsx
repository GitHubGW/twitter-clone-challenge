import { UserCard } from "@/app/(private)/users/[userId]/_components/user-card";
import { Post } from "@/app/_components/post";
import { firebaseStore } from "@/libs/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

interface UserDetailProps {
  userId: string;
}

const UserDetail = async ({ userId }: UserDetailProps) => {
  const getPosts = async () => {
    const collectionReference = collection(firebaseStore, "posts");
    const queryData = query(collectionReference, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(queryData);
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
    return documentDataArray;
  };
  const posts = await getPosts();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col">
        <UserCard />
        {posts.length > 0 && (
          <div className="mt-6 h-[800px] overflow-y-scroll border-gray-300 border-2 rounded-lg p-6">
            <div className="text-3xl">Posts</div>
            <div>
              {posts.map((post) => (
                <Post key={post.id} id={post.id} email={post.email} textarea={post.textarea} imageUrl={post.imageUrl} createdAt={post.createdAt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
