"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { stat } from "fs";

export default function AuthCallbackHandler() {
  console.log("AuthCallbackHandler -----");
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    console.log("🚀 ~ AuthCallbackHandler ~ session:", session)
    console.log("🚀 ~ AuthCallbackHandler ~ status:", status)
    if (status === "loading") return;
    if (session && status === "authenticated") {
      router.push(PageUrl.DASHBOARD);
    } else {
      console.log('>>>>>>>>')
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [session, status]);
  if (status === "loading") return <Loading />;
}
