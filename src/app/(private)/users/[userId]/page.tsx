import { UserDetail } from "./_components/user-detail";

interface UserDetailPageProps {
  params: { userId: string };
}

const UserDetailPage = ({ params }: UserDetailPageProps) => {
  return <UserDetail userId={params.userId} />;
};

export default UserDetailPage;
