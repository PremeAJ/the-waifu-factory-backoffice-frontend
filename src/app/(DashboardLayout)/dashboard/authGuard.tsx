import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Error403 from "../auth/error/403/page";
import Loading from "../loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [isLogingIn, setIsLogingIn] = useState(false);
  const { getUser } = useContext(AuthContext);
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await getUser();
      console.log("🚀 ~ checkSession ~ data:", data)
      if (!data || error) {
        router.replace("/auth/auth1/login");
      } else {
        setIsLogingIn(true);
      }
    };
    checkSession();
  }, [path]);
  return <>{(isLogingIn && children) || <Loading />}</>;
}
