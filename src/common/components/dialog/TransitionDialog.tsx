"use client";
import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar, Box } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import BaseButton from "../base/BaseButton";

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TransitionDialogProps {
  open: boolean;
  title: string;
  content: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmColor?: "primary" | "error" | "success";
  loading?: boolean;
  icon?: string;
  iconSize?: number;
  fullScreen?: boolean;
  scrolling?: boolean;
  htmlContent?: boolean;
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({
  open,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  confirmColor = "primary",
  loading = false,
  icon,
  iconSize = 60,
  fullScreen = false,
  scrolling = false,
  htmlContent = false,
}) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    aria-describedby="alert-dialog-slide-description"
    fullScreen={fullScreen}
    scroll={scrolling ? "paper" : undefined}
  >
    <DialogContent
      dividers={scrolling}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
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
      {typeof content === "string" && htmlContent ? (
        <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: content }} />
      ) : typeof content === "string" ? (
        <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign: "center" }}>
          {content}
        </DialogContentText>
      ) : (
        <Box id="alert-dialog-slide-description">{content}</Box>
      )}
    </DialogContent>
    <DialogActions
      sx={
        fullScreen
          ? {
              flexDirection: "column",
              gap: 2,
              padding: 3,
            }
          : {}
      }
    >
      {fullScreen ? (
        <>
          {confirmText && (
            <BaseButton
              label={confirmText}
              onClick={onConfirm}
              disabled={loading}
              fullWidth={true}
              loading={loading}
              {...(confirmColor ? { color: confirmColor } : null)}
            />
          )}
          {cancelText && <BaseButton label={cancelText} onClick={onClose} disabled={loading} fullWidth={true} variant="outlined" />}
        </>
      ) : (
        <>
          {cancelText && <BaseButton label={cancelText} onClick={onClose} disabled={loading} fullWidth={false} variant="outlined" />}
          {confirmText && (
            <BaseButton
              label={confirmText}
              onClick={onConfirm}
              disabled={loading}
              fullWidth={false}
              loading={loading}
              {...(confirmColor ? { color: confirmColor } : null)}
            />
          )}
        </>
      )}
    </DialogActions>
  </Dialog>
);

export default TransitionDialog;
