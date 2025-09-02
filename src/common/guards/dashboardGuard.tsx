import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  //#region Context
  const { data: session, status } = useSession();
  const { profile } = session || {};
  const { activeCompany } = profile || {};
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  //#endregion

  //#region Check active company
  useEffect(() => {
    if (status === "authenticated" && !activeCompany) setShowCompanyDialog(true);
  }, [session, status]);
  //#endregion

  //#region loading
  if (status === "loading") return <Loading />;
  //#endregion

  return (
    <>
      {children} <SelectCompanyDialog open={showCompanyDialog} onClose={() => setShowCompanyDialog(false)} disableBackdropClose />
    </>
  );
}
