import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Error403 from "../auth/error/403/page";
import Loading from "../loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLogingIn, setIsLogingIn] = useState(false);
  const { getSession } = useContext(AuthContext);
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await getSession();
      if (!data.session || error) {
        router.replace("/auth/auth1/login");
      } else {
        setIsLogingIn(true);
      }
    };
    checkSession();
  }, [router]);
  return <>{(isLogingIn && children) || <Loading />}</>;
}
