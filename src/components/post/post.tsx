import "dayjs/locale/ko";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface PostProps {
  id: string;
  email: string;
  textarea: string;
  imageUrl?: string;
  createdAt: number;
}

const Post = ({ id, email, textarea, imageUrl, createdAt }: PostProps) => {
  const fromNow = dayjs(createdAt).fromNow();

  return (
    <Link href={`/posts/${id}`}>
      <div className="w-[576px] border-b border-gray-200 py-5 cursor-pointer">
        <div>
          <span className="font-semibold">{email}</span>
          <span className="ml-1 mr-1 text-gray-400">•</span>
          <span className="text-gray-600 text-sm">{fromNow}</span>
        </div>
        <div className="mt-2 mb-6">{textarea}</div>
        {imageUrl && <Image src={imageUrl} width={100} height={100} alt="" className="mt-3" />}
      </div>
    </Link>
  );
};

export default Post;
