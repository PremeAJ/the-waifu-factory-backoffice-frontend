import Loading from "@/app/components/shared/loading";
import { AuthContext } from "@/app/context/AuthContext";
import { UserContext } from "@/app/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [isLogingIn, setIsLogingIn] = useState(false);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/dashboard/auth/login");
    } else {
      setIsLogingIn(true);
    }
  }, [path, user, loading]);

  return <>{(isLogingIn && children) || <Loading />}</>;
}
