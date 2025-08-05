import Loading from "@/app/loading";
import { AuthContext } from "@/common/contexts/AuthContext";
import { UserContext } from "@/common/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SelectCompanyDialog from "@/common/components/dialog/SelectCompanyDialog";
import BaseDialog from "@/common/components/base/BaseDialog";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const { user: authUser, isLoading: authLoading } = useContext(AuthContext);
  const { user: appUser, loading: appUserLoading } = useContext(UserContext);
  const isLoading = authLoading || appUserLoading;
  const user = appUser && authUser;
  
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.replace("/dashboard/auth/login");
    } else if (!isLoading && !appUser) {
      setShowDialog(true);
    } else if (appUser && !appUser.companies) {
      setShowCompanyDialog(true);
    } else if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoading, user, appUser]);
  
  const handleDialogClose = () => {
    setShowDialog(false);
    router.replace("/dashboard/auth/login");
  };
  
  if (isLoading) return <Loading />;
  return (
    <>
      <BaseDialog
        open={showDialog}
        title="เกิดข้อผิดพลาด"
        content="Session ของคุณหมดอายุหรือไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่"
        confirmText="เข้าสู่ระบบ"
        onConfirm={handleDialogClose}
        onClose={handleDialogClose}
        confirmColor="primary"
      />
      <SelectCompanyDialog open={showCompanyDialog} onClose={() => setShowCompanyDialog(false)} disableBackdropClose/>
      {(isAuthenticated && children) || <Loading />}
    </>
  );
}
