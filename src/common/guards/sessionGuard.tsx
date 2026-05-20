import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageUrl } from "../constants/pageUrl";
import PageLoader from "../components/loaders/PageLoader";
import { useWaifuUser } from "../contexts/WaifuUserContext";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useWaifuUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(PageUrl.AUTH_SIGN_IN);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <PageLoader />;
  return <>{children}</>;
}
