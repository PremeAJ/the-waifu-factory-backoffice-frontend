import Loading from "@/app/loading";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { IconUser, IconPlus } from '@tabler/icons-react';
import TransitionDialog from "@/components/base/Dialog/TransitionDialog";
import CompanyAvatar from "@/components/avatar/CompanyAvatar";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const { user: authUser, isLoading: authLoading } = useContext(AuthContext);
  const { user: appUser, loading: appUserLoading, companyList, companyListLoading } = useContext(UserContext);
  const isLoading = authLoading || appUserLoading;
  const user = appUser && authUser;

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.replace("/dashboard/auth/login");
    } else if (!isLoading && !appUser) {
      setShowDialog(true);
    } else if (appUser && (!appUser.activeCompanyId || companyList.length === 0)) {
      setShowCompanyDialog(true);
    } else if (!isLoading && user) {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoading, user, appUser, companyList.length]);

  const handleDialogClose = () => {
    setShowDialog(false);
    router.replace("/dashboard/auth/login");
  };

  const handleCompanyDialogClose = (companyIdOrAdd: string) => {
    setShowCompanyDialog(false);
    // ถ้าเลือกบริษัท ให้ set activeCompanyId (ถ้ามี logic นี้)
    // ถ้าเลือก addAccount ให้ redirect ไปหน้า select-company
    router.replace("/dashboard/create-company");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Dialog
        open={showCompanyDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            // ไม่ทำอะไร = ไม่ปิด dialog
            return;
          }
          // ถ้าอยากให้ปิด dialog ด้วยปุ่มใน dialog ให้เรียก setOpen(false) ที่ปุ่มเท่านั้น
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>เลือกบริษัทที่ต้องการใช้งาน</DialogTitle>
        <List sx={{ pt: 0 }}>
          {companyList.map((company: any) => (
            <ListItemButton onClick={() => handleCompanyDialogClose(company.companies.id)} key={company.companies.id}>
              <ListItemAvatar>
                {/* <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                  <IconUser width={20} height={20} />
                </Avatar> */}
              <CompanyAvatar businessTypeId={1} />
              </ListItemAvatar>
              <ListItemText primary={company.companies.name} />
            </ListItemButton>
          ))}
          <ListItemButton autoFocus onClick={() => handleCompanyDialogClose("addAccount")}>
            <ListItemAvatar>
              <Avatar>
                <IconPlus width={20} height={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="เพิ่มบริษัทใหม่" />
          </ListItemButton>
        </List>
      </Dialog>
      <TransitionDialog
        open={showDialog}
        title="เกิดข้อผิดพลาด"
        content="Session ของคุณหมดอายุหรือไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่"
        confirmText="เข้าสู่ระบบ"
        onConfirm={handleDialogClose}
        onClose={handleDialogClose}
        confirmColor="primary"
      />
      {(isAuthenticated && children) || <Loading />}
    </>
  );
}
