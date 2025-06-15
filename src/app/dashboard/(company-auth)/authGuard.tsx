import Loading from "@/app/loading";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import TransitionDialog from "@/components/base/Dialog/TransitionDialog";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const { user: authUser, isLoading: authLoading, getSession } = useContext(AuthContext);
  const { user: appUser, loading: appUserLoading } = useContext(UserContext);
  const [sessionChecked, setSessionChecked] = useState(false);
  useEffect(() => {
    getSession?.().finally(() => setSessionChecked(true));
  }, []);

  const isLoading = authLoading || appUserLoading || !sessionChecked;
  const user = appUser && authUser;

  useEffect(() => {
    if (!isLoading && !user) {
      setShowDialog(true);
    } else if (appUser && !appUser.activeCompanyId) {
      setShowCompanyDialog(true);
    } else if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoading, user, appUser]);

  const handleDialogClose = () => {
    setShowDialog(false);
    router.replace("/dashboard/auth/login");
  };

  const handleCompanyDialogClose = () => {
    setShowCompanyDialog(false);
    router.replace("/dashboard/select-company");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TransitionDialog
        open={showDialog}
        title="เกิดข้อผิดพลาด"
        content="Session ของคุณหมดอายุหรือไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่"
        confirmText="เข้าสู่ระบบ"
        onConfirm={handleDialogClose}
        onClose={handleDialogClose}
        confirmColor="primary"
      />
      <TransitionDialog
        open={showCompanyDialog}
        title="กรุณาเลือกบริษัท"
        content="คุณยังไม่ได้เลือกบริษัทที่ใช้งาน กรุณาเลือกบริษัทก่อนดำเนินการต่อ"
        confirmText="เลือกบริษัท"
        onConfirm={handleCompanyDialogClose}
        onClose={handleCompanyDialogClose}
        confirmColor="primary"
      />
      {(isAuthenticated && children) || <Loading />}
    </>
  );
}
