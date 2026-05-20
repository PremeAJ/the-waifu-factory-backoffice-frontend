import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageUrl } from "../constants/pageUrl";
import PageLoader from "../components/loaders/PageLoader";
import { useWaifuUser } from "../contexts/WaifuUserContext";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useWaifuUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <PageLoader />;
  return <>{children}</>;
}
