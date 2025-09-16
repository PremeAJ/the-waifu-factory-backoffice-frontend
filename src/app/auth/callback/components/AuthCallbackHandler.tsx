"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { PageUrl } from "@/common/constants/pageUrl";

interface AuthCallbackHandlerProps {
  redirectPath: string;
  loginPath: string;
}

export default function AuthCallbackHandler() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return;
    if (session && status === "authenticated") {
      router.push(PageUrl.DASHBOARD);
    } else {
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [session, status]);
  if (status === "loading") return <Loading />;
}
