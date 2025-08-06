"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar, Box } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import BaseButton from "@/common/components/base/BaseButton";

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BaseDialogProps {
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
  iconType?: "success" | "error" | "warning" | "info";
  iconSize?: number;
  fullScreen?: boolean;
  scrolling?: boolean;
  htmlContent?: boolean;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
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
  iconType,
  iconSize = 80,
  fullScreen = false,
  scrolling = false,
  htmlContent = false,
}) => {
  const getIconComponent = () => {
    if (!iconType) return null;
    
    const iconProps = { size: iconSize };
    
    switch (iconType) {
      case "success":
        return <IconCircleCheck {...iconProps} style={{ color: "#4caf50" }} />;
      case "error":
        return <IconX {...iconProps} style={{ color: "#f44336" }} />;
      case "warning":
        return <IconAlertTriangle {...iconProps} style={{ color: "#ff9800" }} />;
      case "info":
        return <IconInfoCircle {...iconProps} style={{ color: "#2196f3" }} />;
      default:
        return null;
    }
  };

  return (
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
          minWidth: 320
        }}
      >
        {(icon || iconType) && (
          <Box display="flex" justifyContent="center" >
            {iconType ? (
              getIconComponent()
            ) : (
              <Avatar
                src={icon}
                sx={{
                  width: iconSize,
                  height: iconSize,
                  bgcolor: "transparent",
                }}
              />
            )}
          </Box>
        )}
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
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
            : {
              margin: 1
            }
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
};

export default BaseDialog;
