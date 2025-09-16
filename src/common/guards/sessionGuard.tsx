import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseDialog from "@/common/components/base/BaseDialog";
import Loading from "@/app/loading";
import { useEffect } from "react";
import { PageUrl } from "../constants/pageUrl";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session?.profile) {
      router.push(PageUrl.AUTH_SIGN_IN);
    }
  }, [status, session, router]);

  return (
    <>
      {(status === "authenticated" && session?.profile && children) || <Loading />}
    </>
  );
}
