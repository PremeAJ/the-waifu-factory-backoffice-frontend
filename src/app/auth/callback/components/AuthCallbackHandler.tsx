"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";

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
      router.push("/dashboard");
    } else {
      router.replace("/auth/sign-in");
    }
  }, [session, status]);
  if (status === "loading") return <Loading />;
}
