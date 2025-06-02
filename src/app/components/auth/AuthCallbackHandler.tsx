"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { supabaseGetSession } from "@/utils/supabase/client";
import { UserContext } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import { CustomizerContext } from "@/app/context/setting/customizerContext";

interface AuthCallbackHandlerProps {
  redirectPath: string;
  loginPath: string;
}

export default function AuthCallbackHandler({ redirectPath, loginPath }: AuthCallbackHandlerProps) {
  const router = useRouter();
  const { setSession, getSession } = useContext(AuthContext);
  const { syncUser } = useContext(UserContext);
  const { appearanceMutate } = useContext(CustomizerContext);

  useEffect(() => {
    const handleAuth = async () => {
      const { data: csrData } = await supabaseGetSession();
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
        await syncUser();
        await appearanceMutate();
        await new Promise((res) => setTimeout(res, 1000)); // ถ้าต้องการรอ 1 วิ
        router.replace(redirectPath);
      } else {
        router.replace(loginPath);
      }
    };

    handleAuth();
  }, [redirectPath, loginPath]);

  return <Loading />;
}
