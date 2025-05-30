import { UserContext } from "@/app/context/UserContext";
import { useContext } from "react";
import Loading from "../loading";
import Error404 from "../auth/error/404/page";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <Error404 />;
  }

  return <>{children}</>;
}
