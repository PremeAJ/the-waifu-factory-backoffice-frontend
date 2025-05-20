import { AuthContext } from "@/app/context/AuthContext";
import Loading from "@/app/loading";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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
