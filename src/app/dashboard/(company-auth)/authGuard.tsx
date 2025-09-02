import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseDialog from "@/common/components/base/BaseDialog";
import Loading from "@/app/loading";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  //#region Context
  const { data: session, status } = useSession();
  const { profile } = session || {};
  const { activeCompany } = profile || {};
  const router = useRouter();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  //#endregion

  const handleDialogClose = () => router.replace("/auth/sign-in");

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
      <SelectCompanyDialog open={showCompanyDialog} onClose={() => setShowCompanyDialog(false)} disableBackdropClose />
      <BaseDialog
        open={!profile}
        title="เกิดข้อผิดพลาด"
        content="Session ของคุณหมดอายุหรือไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่"
        confirmText="เข้าสู่ระบบ"
        onConfirm={handleDialogClose}
        onClose={handleDialogClose}
        confirmColor="primary"
      />
    </>
  );
}
