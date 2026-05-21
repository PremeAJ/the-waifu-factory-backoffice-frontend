"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/common/components/loaders/PageLoader";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const { refetch } = useCurrentUser();

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await refetch();
        if (data?.data) {
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
