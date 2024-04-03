import ROUTES from "@/constants/routes";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="text-3xl">존재하지 않는 페이지입니다.</div>
      <Link href={ROUTES.HOME} className="text-blue-500 text-2xl underline">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
