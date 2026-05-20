"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/common/components/loaders/PageLoader";
import { useWaifuUser } from "@/common/contexts/WaifuUserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const { refetch } = useWaifuUser();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const json = await res.json();
        if (json.isSuccess && json.data) {
          await refetch();
          router.replace(PageUrl.HOME);
        } else {
          router.replace(PageUrl.AUTH_SIGN_IN);
        }
      } catch {
        router.replace(PageUrl.AUTH_SIGN_IN);
      }
    };
    verify();
  }, []);

  return <PageLoader />;
}
