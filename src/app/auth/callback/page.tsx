"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { csrGetSession } from "@/utils/supabase/client";
import Loading from "@/app/loading";

export default function AuthCallback() {
  const router = useRouter();
  const { setSession } = useContext(AuthContext);

  useEffect(() => {
    csrGetSession().then(async ({ data }) => {
      if (data.session) {
        const { access_token, refresh_token } = data.session;
        await setSession({
          access_token,
          refresh_token,
        });
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000); // รอ 1 วินาทีก่อน redirect
      } else {
        setTimeout(() => {
          router.replace("/auth/login");
        }, 1000);
      }
    });
  }, []);

  return (<Loading/>);
}
