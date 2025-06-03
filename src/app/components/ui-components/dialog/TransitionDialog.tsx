"use client";
import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide } from "@mui/material";
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
}) => (
  <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose} aria-describedby="alert-dialog-slide-description">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {/* <Button onClick={onClose} color="primary" disabled={loading}>
        {cancelText}
      </Button> */}
      <BaseButton label={cancelText} onClick={onClose} disabled={loading} fullWidth={false} />
      <BaseButton label={confirmText} onClick={onConfirm} disabled={loading} fullWidth={false} {...(confirmColor ? { color: confirmColor } : null)} />
    </DialogActions>
  </Dialog>
);

export default TransitionDialog;
