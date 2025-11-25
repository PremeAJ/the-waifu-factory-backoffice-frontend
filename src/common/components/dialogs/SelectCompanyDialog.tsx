import { IconPlus } from "@tabler/icons-react";
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip, Skeleton, Box } from "@mui/material";
import { PageUrl } from "@/common/constants/pageUrl";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseDialog from "../base/BaseDialog";
import CompanyAvatar from "@/common/components/avatar/CompanyAvatar";
import React from "react";

interface SelectCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  disableBackdropClose?: boolean;
}

const SelectCompanyDialog: React.FC<SelectCompanyDialogProps> = ({ open, onClose, disableBackdropClose = false }) => {
  const { companyList, updateActiveCompany, loading } = useProfile();
  const { data: session } = useSession();
  const { activeCompany } = session?.profile || {};
  const router = useRouter();

  const handleSelect = async (companyId: string) => {
    if (companyId === "addAccount") {
      router.push("/pricing");
    } else {
      await updateActiveCompany(companyId);
      router.push(PageUrl.HOME);
    }
    if (onClose) onClose();
  };

  const skeletonList = (
    <List sx={{ pt: 0 }}>
      {[1, 2, 3].map((i) => (
        <ListItemButton key={i} disabled sx={{ px: 2, py: 1 }}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="30%" />
          </Box>
        </ListItemButton>
      ))}
    </List>
  );

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
              <CompanyAvatar icon={company.companies.icon} />
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
      <ListItemButton onClick={() => handleSelect("addAccount")}>
        <ListItemAvatar>
          <Avatar>
            <IconPlus width={20} height={20} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="เพิ่มบริษัทใหม่" />
      </ListItemButton>
    </List>
  );

  return (
    <BaseDialog
      loading={loading}
      content={loading ? skeletonList : companyListContent}
      disableBackdropClose={disableBackdropClose}
      noAction={true}
      onClose={onClose}
      onConfirm={() => {}}
      open={open}
      title="เลือกบริษัทที่ต้องการใช้งาน"
    />
  );
};

export default SelectCompanyDialog;
