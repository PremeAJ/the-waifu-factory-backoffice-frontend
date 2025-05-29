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
  const { refreshUser, syncUser } = useContext(UserContext);

  useEffect(() => {
    csrGetSession().then(async ({ data }) => {
      if (data.session) {
        const { access_token, refresh_token } = data.session;
        const session = await getSession();
        if (!session.data.session) {
          await setSession({
            access_token,
            refresh_token,
          });
        }
        syncUser();
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      } else {
        setTimeout(() => {
          router.replace("/dashboard/auth/login");
        }, 1000);
      }
    });
  }, []);

  return <Loading />;
}
