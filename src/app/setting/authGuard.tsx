import { UserContext } from "@/app/context/UserContext";
import { useContext } from "react";
import Loading from "../loading";
import Error404 from "../auth/error/404/page";
import { redirect } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    // redirect("/dashboard");
    return <Error404 />;
  }

  return <>{children}</>;
}
