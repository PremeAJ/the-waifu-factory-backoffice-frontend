"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { csrGetSession } from "@/utils/supabase/client";
import Loading from "@/app/loading";

// async function syncUser(userId: string) {
//   // เรียก API backend ของคุณเพื่อเช็ค/สร้าง user
//   await fetch("/api/user/sync", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId }),
//   });
// }


export default function AuthCallback() {
  const router = useRouter();
  const { setSession, getSession } = useContext(AuthContext);

  useEffect(() => {
    csrGetSession().then(async ({ data }) => {
      if (data.session) {
        const { access_token, refresh_token, user } = data.session;
        const session = await getSession();
        if (!session.data.session) {
          await setSession({
            access_token,
            refresh_token,
          });
        }
        // if (user?.id) {
        //   await syncUser(user.id);
        // }
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
