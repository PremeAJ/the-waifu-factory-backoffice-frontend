"use client";
import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar, Box } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import BaseButton from "../../forms/theme-elements/BaseButton";

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TransitionDialogProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmColor?: "primary" | "error" | "success";
  loading?: boolean;
  icon?: string; // เพิ่ม prop สำหรับ icon path
  iconSize?: number; // เพิ่ม prop สำหรับขนาด icon
  fullScreen?: boolean; // เพิ่ม prop สำหรับ full screen
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({
  open,
  title,
  content,
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
  onConfirm,
  onClose,
  confirmColor = "primary",
  loading = false,
  icon,
  iconSize = 60,
  fullScreen = false,
}) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    aria-describedby="alert-dialog-slide-description"
    fullScreen={fullScreen}
  >
    <Box my={fullScreen ? "50%" : 0} maxWidth={"sm"} alignSelf={"center"}>
      <DialogTitle sx={{ textAlign: "center", pb: icon ? 1 : 2 }}>
        {icon && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              src={icon}
              sx={{
                width: iconSize,
                height: iconSize,
                bgcolor: "transparent",
              }}
            />
          </Box>
        )}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign: "center" }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={fullScreen ? {
        flexDirection: "column",
        gap: 2,
        padding: 3
      } : {}}>
        <BaseButton 
          label={confirmText} 
          onClick={onConfirm} 
          disabled={loading} 
          fullWidth={fullScreen} 
          {...(confirmColor ? { color: confirmColor } : null)}
        />
        <BaseButton 
          label={cancelText} 
          onClick={onClose} 
          disabled={loading} 
          fullWidth={fullScreen} 
          variant="outlined" 
        />
      </DialogActions>
    </Box>
  </Dialog>
);

export default TransitionDialog;
