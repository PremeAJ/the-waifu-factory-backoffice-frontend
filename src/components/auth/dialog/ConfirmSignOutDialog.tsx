import React from "react";
import TransitionDialog from "@/components/ui-components/dialog/TransitionDialog";
import { minWidth } from "@mui/system";

interface ConfirmSignOutDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const ConfirmSignOutDialog: React.FC<ConfirmSignOutDialogProps> = ({
  open,
  onConfirm,
  onClose,
  loading = false,
}) => (
  <TransitionDialog
    open={open}
    title="ออกจากระบบ"
    content="คุณต้องการออกจากระบบใช่หรือไม่?"
    confirmText="ออกจากระบบ"
    cancelText="ยกเลิก"
    confirmColor="error"
    onConfirm={onConfirm}
    onClose={onClose}
    loading={loading}
  />
);

export default ConfirmSignOutDialog;