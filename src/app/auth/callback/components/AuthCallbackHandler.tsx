"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/common/components/loaders/PageLoader";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          router.replace(PageUrl.HOME);
        } else {
          router.replace(PageUrl.AUTH_SIGN_IN);
        }
      } catch {
        router.replace(PageUrl.AUTH_SIGN_IN);
      }
    };
    verifySession();
  }, []);

  return <PageLoader />;
}
