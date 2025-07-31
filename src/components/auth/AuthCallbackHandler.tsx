"use client";
import { useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { supabaseGetSession } from "@/common/utils/supabase/client";
import { UserContext } from "@/context/UserContext";
import Loading from "@/app/loading";
import { CustomizerContext } from "@/context/setting/customizerContext";

interface AuthCallbackHandlerProps {
  redirectPath: string;
  loginPath: string;
}

export default function AuthCallbackHandler({ redirectPath, loginPath }: AuthCallbackHandlerProps) {
  const { setSession, getSession, exchangeCodeForSession } = useContext(AuthContext);
  const { syncUser } = useContext(UserContext);
  const { appearanceMutate } = useContext(CustomizerContext);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const code = params.get("code") || "";
      await exchangeCodeForSession(code)
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
        await new Promise((res) => setTimeout(res, 1000)); 
        router.replace(redirectPath);
      } else {
        router.replace(loginPath);
      }
    };

    handleAuth();
  }, [redirectPath, loginPath]);

  return <Loading />;
}
