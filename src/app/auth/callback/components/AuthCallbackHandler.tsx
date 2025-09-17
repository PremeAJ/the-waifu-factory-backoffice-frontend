"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session && status === "authenticated") {
      router.push(PageUrl.DASHBOARD);
    } else {
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [session, status]);
  if (status === "loading") return <Loading />;
}
