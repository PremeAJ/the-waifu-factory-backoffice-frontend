import Loading from "@/app/loading";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user: authUser, isLoading: authLoading } = useContext(AuthContext);
  const { user: appUser, loading: appUserLoading } = useContext(UserContext);
  const isLoading = authLoading || appUserLoading;
  const user = appUser && authUser;
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/dashboard/auth/login");
    } else if (appUser && !appUser.activeCompanyId) {
      router.replace("/dashboard/select-company");
    } else if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoading, user]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{isAuthenticated ? children : <Loading />}</>;
}
