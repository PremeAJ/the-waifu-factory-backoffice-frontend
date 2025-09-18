"use client";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar, Box, SxProps, Theme } from "@mui/material";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { TransitionProps } from "@mui/material/transitions";
import BaseButton from "@/common/components/base/BaseButton";
import React from "react";

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BaseDialogProps {
  cancelText?: string;
  confirmColor?: "primary" | "error" | "success";
  confirmText?: string;
  content: string | React.ReactNode;
  disableBackdropClose?: boolean; 
  fullScreen?: boolean;
  htmlContent?: boolean;
  icon?: string;
  iconSize?: number;
  iconType?: "success" | "error" | "warning" | "info";
  loading?: boolean;
  noAction?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  scrolling?: boolean;
  title: string;
  sx?: SxProps<Theme>;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  cancelText,
  confirmColor = "primary",
  confirmText,
  content,
  disableBackdropClose = true,
  fullScreen = false,
  htmlContent = false,
  icon,
  iconSize = 80,
  iconType,
  loading = false,
  noAction = false,
  onClose,
  onConfirm,
  open,
  scrolling = false,
  title,
  sx,
}) => {
  const handleDialogClose = (event?: object, reason?: string) => {
    if (disableBackdropClose && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    onClose();
  };

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
      onClose={handleDialogClose}
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
      scroll={scrolling ? "paper" : undefined}
      sx={sx}
    >
      <DialogContent
        dividers={scrolling}
        sx={{
          minWidth: 320,
        }}
      >
        {(icon || iconType) && (
          <Box display="flex" justifyContent="center">
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
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>{title}</DialogTitle>
        {typeof content === "string" && htmlContent ? (
          <Box>
            <DialogContentText
              id="alert-dialog-slide-description"
              sx={{
                textAlign: "left",
                color: "text.primary",
                a: { color: "primary.main" },
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Box>
        ) : typeof content === "string" ? (
          <DialogContentText id="alert-dialog-slide-description" sx={{ textAlign: "center" }}>
            {content}
          </DialogContentText>
        ) : (
          <Box id="alert-dialog-slide-description">{content}</Box>
        )}
      </DialogContent>
      {noAction ? null : (
      <DialogActions
        sx={
          fullScreen
            ? {
                flexDirection: "column",
                gap: 2,
                padding: 3,
              }
            : {
                margin: 1,
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
                {...(confirmColor ? { color: "primary" } : null)}
              />
            )}
          </>
        )}
      </DialogActions>
      )}
    </Dialog>
  );
};

export default BaseDialog;
