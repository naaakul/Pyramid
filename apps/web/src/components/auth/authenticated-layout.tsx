import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/api/auth";
import { CurrentUserProvider } from "@/lib/auth/current-user-context";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const user = await getCurrentUser(cookieStore.toString());

  if (!user) {
    redirect("/login");
  }

  return (
    <CurrentUserProvider user={user}>
      {children}
    </CurrentUserProvider>
  );
}