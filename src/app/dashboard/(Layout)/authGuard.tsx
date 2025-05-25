import { AuthContext } from "@/app/context/AuthContext";
import { UserContext } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [isLogingIn, setIsLogingIn] = useState(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    const checkSession = async () => {
      if (!user) {
        router.replace("/dashboard/auth/login");
      } else {
        setIsLogingIn(true);
      }
    };
    checkSession();
  }, [path]);
  return <>{(isLogingIn && children) || <Loading />}</>;
}
