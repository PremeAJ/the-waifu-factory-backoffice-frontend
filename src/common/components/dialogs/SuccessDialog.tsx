"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import BaseDialog from "@/common/components/base/BaseDialog";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  disableBackdropClose?: boolean;
  callback?: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onClose,
  title = "สำเร็จ",
  message = "ดำเนินการสำเร็จ",
  disableBackdropClose = false,
  callback,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (open && callback) {
      const timer = setTimeout(() => {
        router.replace(callback);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, callback, router, onClose]);

  return (
    <BaseDialog
      open={open}
      onClose={disableBackdropClose ? () => {} : onClose}
      title={title}
      iconType="success"
      content={
        <Box>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {message}
          </Typography>
        </Box>
      }
      confirmText={undefined} // ไม่ต้องโชว์ปุ่มตกลง
      onConfirm={() => {}}
      confirmColor="success"
      disableBackdropClose={disableBackdropClose}
    />
  );
};

export default SuccessDialog;