"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { csrGetSession } from "@/utils/supabase/client";
import { UserContext } from "@/app/context/UserContext";
import Loading from "@/app/components/shared/loading";

export default function AuthCallback() {
  const router = useRouter();
  const { setSession, getSession } = useContext(AuthContext);
  const { syncUser} = useContext(UserContext);
  
  useEffect(() => {
    csrGetSession().then(async ({ data }) => {
      if (data.session) {
        const session = await getSession();
        const { access_token, refresh_token } = data.session;
        if (!session.data.session) {
          await setSession({
            access_token,
            refresh_token,
          });
        }
        syncUser()
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      } else {
        setTimeout(() => {
          router.replace("/auth/login");
        }, 1000);
      }
    });
  }, []);

  return <Loading />;
}
