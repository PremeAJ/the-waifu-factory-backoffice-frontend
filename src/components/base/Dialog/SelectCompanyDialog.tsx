import React, { useContext } from "react";
import { Dialog, DialogTitle, List, ListItemButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import CompanyAvatar from "@/components/avatar/CompanyAvatar";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface SelectCompanyDialogProps {
  open: boolean;
  onClose?: () => void;
}

const SelectCompanyDialog: React.FC<SelectCompanyDialogProps> = ({ open, onClose }) => {
  const { companyList, setActiveCompany } = useContext(UserContext);
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
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown>
      <DialogTitle>เลือกบริษัทที่ต้องการใช้งาน</DialogTitle>
      <List sx={{ pt: 0 }}>
        {companyList.map((company) => (
          <ListItemButton onClick={() => handleSelect(company.companies.id)} key={company.companies.id}>
            <ListItemAvatar>
              <CompanyAvatar businessTypeId={company.companies.businessTypeId} />
            </ListItemAvatar>
            <ListItemText primary={company.companies.name} />
          </ListItemButton>
        ))}
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