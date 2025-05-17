import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ServerAuthGuard({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const hasAuthCookie = (await cookieStore).getAll().some((c) =>
    c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );
  if (!hasAuthCookie) {
    redirect("/auth/auth1/login");
  }
  return <>{children}</>;
}