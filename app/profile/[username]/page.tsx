import { getUser } from "@/lib/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { Profile } from "@/components/Profile";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = await params;
  const user = await getUser(username);
  const session = await getServerSession(authOptions);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <Profile user={user} session={session} />
    </div>
  );
}
