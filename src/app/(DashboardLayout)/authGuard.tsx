import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { getSession } = useContext(AuthContext);
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await getSession();
      if (!data.session || error) {
        router.replace("/auth/auth1/login");
      }
    };
    checkSession();
  }, [router]);
  return <>{children}</>;
}
