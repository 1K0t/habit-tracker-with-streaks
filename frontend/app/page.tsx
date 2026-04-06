import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginPage } from "@/components/LoginPage/LoginPage";

export default async function HomePage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/habits");
  }

  return <LoginPage />;
}
