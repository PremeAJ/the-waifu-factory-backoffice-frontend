import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";
import BaseDialog from "@/common/components/base/BaseDialog";
import { useSession } from "next-auth/react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  //#region Context
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  //#endregion

  const handleDialogClose = () => router.replace("/dashboard/auth/login");

  //#region Check active company
  useEffect(() => {
    if (!session?.profile?.activeCompany && status !== "loading") {
      setShowCompanyDialog(true);
    }
  }, [session, status]);
  //#endregion

  //#region loading
  if (status === "loading") return <Loading />;
  //#endregion
  return (
    <>
      <SelectCompanyDialog open={showCompanyDialog} onClose={() => setShowCompanyDialog(false)} disableBackdropClose />
      <BaseDialog
        open={status === "unauthenticated" && !session}
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
