import React, { useContext } from "react";
import { Dialog, DialogTitle, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import CompanyAvatar from "@/components/avatar/CompanyAvatar";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface SelectCompanyDialogProps {
  open: boolean;
  onClose?: () => void;
  disableBackdropClose?: boolean; // เพิ่ม prop นี้
}

const SelectCompanyDialog: React.FC<SelectCompanyDialogProps> = ({
  open,
  onClose,
  disableBackdropClose = false,
}) => {
  const { companyList, setActiveCompany, user } = useContext(UserContext);
  const { companies } = user || {};
  const router = useRouter();

  const handleSelect = async (companyId: string) => {
    if (companyId === "addAccount") {
      router.push("/pricing");
    } else {
      await setActiveCompany(companyId);
      router.push("/dashboard");
    }
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (disableBackdropClose && (reason === "backdropClick" || reason === "escapeKeyDown")) {
          return;
        }
        if (onClose) onClose();
      }}
      disableEscapeKeyDown={disableBackdropClose}
    >
      <DialogTitle>เลือกบริษัทที่ต้องการใช้งาน</DialogTitle>
      <List sx={{ pt: 0 }}>
        {companyList.map((company) => {
          const isActive = companies?.id === company.companies.id;
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
                    {isActive && (
                      <Chip
                        label="กำลังใช้งาน"
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
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
    </Dialog>
  );
};

export default SelectCompanyDialog;

