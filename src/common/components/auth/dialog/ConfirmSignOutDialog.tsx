import React from "react";
import BaseDialog from "@/common/components/base/BaseDialog";

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
  <BaseDialog
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