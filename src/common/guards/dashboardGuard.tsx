import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";
import PageLoader from "../components/loaders/PageLoader";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  //#region Context
  const { data: session, status } = useSession();
  const { profile } = session || {};
  const { activeCompany } = profile || {};
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  //#endregion

  //#region Check active company
  useEffect(() => {
    if (status === "authenticated" && !activeCompany) {
      setShowCompanyDialog(true);
    } else {
      setShowCompanyDialog(false);
    }
  }, [session, status, activeCompany]);
  //#endregion

  //#region loading
  if (status === "loading") return <PageLoader />;
  //#endregion

  return (
    <>
      {activeCompany && children}
      <SelectCompanyDialog open={showCompanyDialog} onClose={() => setShowCompanyDialog(false)} disableBackdropClose={true} />
    </>
  );
}
