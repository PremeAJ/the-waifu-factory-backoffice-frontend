"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageLoader from "@/common/components/loaders/PageLoader";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return;
    if (session && status === "authenticated") {
      router.push(PageUrl.HOME);
    } else {
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [session, status]);
  if (status === "loading") return <PageLoader />;
}
