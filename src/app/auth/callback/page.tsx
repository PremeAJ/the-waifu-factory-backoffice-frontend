"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { csrGetSession } from "@/utils/supabase/client";
import { UserContext } from "@/app/context/UserContext";
import Loading from "@/app/loading";

export default function AuthCallback() {
  const router = useRouter();
  const { setSession, getSession } = useContext(AuthContext);
  const { syncUser } = useContext(UserContext);

  useEffect(() => {
    const handleAuth = async () => {
      const { data: csrData } = await csrGetSession();
      if (csrData.session) {
        const { access_token, refresh_token } = csrData.session;
        await setSession({
          access_token,
          refresh_token,
        });
      }
      localStorage.clear();

      const { data: clientData } = await getSession();
      if (clientData.session) {
        syncUser();
        router.replace("/");
      } else {
        router.replace("/auth/login");
      }
    };

    handleAuth();
  }, []);

  return <Loading />;
}
