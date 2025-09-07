"use client";
import { useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/common/contexts/UserContext";
import Loading from "@/app/loading";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useSession } from "next-auth/react";

interface AuthCallbackHandlerProps {
  redirectPath: string;
  loginPath: string;
}

export default function AuthCallbackHandler() {
  const { syncUser } = useContext(UserContext);
  const { appearanceMutate } = useContext(CustomizerContext);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return;
    if (session && status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.replace("/auth/sign-in");
    }
  }, [session, status]);
  if (status === "loading") return <Loading />;
}
