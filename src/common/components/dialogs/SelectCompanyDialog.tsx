import { IconPlus } from "@tabler/icons-react";
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip } from "@mui/material";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseDialog from "../base/BaseDialog";
import CompanyAvatar from "@/common/components/avatar/CompanyAvatar";
import React from "react";
import { PageUrl } from "@/common/constants/pageUrl";

interface SelectCompanyDialogProps {
  open: boolean;
  onClose?: () => void;
  disableBackdropClose?: boolean; // เพิ่ม prop นี้
}

const SelectCompanyDialog: React.FC<SelectCompanyDialogProps> = ({ open, onClose, disableBackdropClose = false }) => {
  const { companyList, updateActiveCompany } = useProfile();
  const { data: session } = useSession();
  const { activeCompany } = session?.profile || {};
  const router = useRouter();

  const handleSelect = async (companyId: string) => {
    if (companyId === "addAccount") {
      router.push("/pricing");
    } else {
      await updateActiveCompany(companyId);
      router.push(PageUrl.DASHBOARD);
    }
    if (onClose) onClose();
  };

  const companyListContent = (
    <List sx={{ pt: 0 }}>
      {companyList.map((company) => {
        const isActive = activeCompany === company.companies.id;
        return (
          <ListItemButton
            onClick={() => !isActive && handleSelect(company.companies.id)}
            key={company.companies.id}
            disabled={isActive}
            selected={isActive}
            sx={isActive ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          >
            <ListItemAvatar>
              <CompanyAvatar businessTypeId={company.companies.businessTypeId} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {company.companies.name}
                  {isActive && <Chip label="กำลังใช้งาน" color="primary" size="small" sx={{ ml: 1 }} />}
                </span>
              }
            />
          </ListItemButton>
        );
      })}
      <ListItemButton autoFocus onClick={() => handleSelect("addAccount")}>
        <ListItemAvatar>
          <Avatar>
            <IconPlus width={20} height={20} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="เพิ่มบริษัทใหม่" />
      </ListItemButton>
    </List>
  );

  const handleDialogClose = (event?: object, reason?: string) => {
    if (disableBackdropClose && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    if (onClose) onClose();
  };

  return <BaseDialog open={open} title="เลือกบริษัทที่ต้องการใช้งาน" content={companyListContent} onClose={handleDialogClose} onConfirm={() => {}} disableBackdropClose/>;
};

export default SelectCompanyDialog;
