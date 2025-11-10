"use client";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar, Box, SxProps, Theme, IconButton } from "@mui/material";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { TransitionProps } from "@mui/material/transitions";
import BaseButton from "@/common/components/base/BaseButton";
import React from "react";

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BaseDialogProps {
  cancelDisabled?: boolean;
  cancelText?: string;
  confirmColor?: "primary" | "error" | "success";
  confirmDisabled?: boolean;
  confirmText?: string;
  content: string | React.ReactNode;
  disableBackdropClose?: boolean;
  fullScreen?: boolean;
  fullScreenCenter?: boolean;
  htmlContent?: boolean;
  icon?: string | React.ReactNode;
  iconSize?: number;
  iconType?: "success" | "error" | "warning" | "info";
  loading?: boolean;
  noAction?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  open: boolean;
  scrolling?: boolean;
  showCloseButton?: boolean; // เพิ่ม prop นี้
  sx?: SxProps<Theme>;
  title: string;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  cancelDisabled = false,
  cancelText,
  confirmColor = "primary",
  confirmDisabled = false,
  confirmText,
  content,
  disableBackdropClose = true,
  fullScreen = false,
  fullScreenCenter = false,
  htmlContent = false,
  icon,
  iconSize = 80,
  iconType,
  loading = false,
  noAction = false,
  onClose,
  onConfirm,
  onCancel,
  open,
  scrolling = false,
  showCloseButton = false, // default false
  sx,
  title,
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

  const dialogContentSx: SxProps<Theme> = {
    minWidth: 320,
    ...(fullScreen && fullScreenCenter
      ? {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          boxSizing: "border-box",
          textAlign: "center",
        }
      : {}),
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
      {/* Close Button - มุมขวาบน */}
      {showCloseButton && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <IconX size={20} />
        </IconButton>
      )}

      <DialogContent dividers={scrolling} sx={dialogContentSx}>
        {(icon || iconType) && (
          <Box display="flex" justifyContent="center" mb={2}>
            {iconType ? (
              getIconComponent()
            ) : typeof icon === "string" ? (
              <Avatar
                src={icon}
                sx={{
                  width: iconSize,
                  height: iconSize,
                  bgcolor: "transparent",
                }}
              />
            ) : (
              icon
            )}
          </Box>
        )}
        <DialogTitle sx={{ textAlign: "center", pt: 0, pb: 1 }}>{title}</DialogTitle>
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
                  disabled={loading || confirmDisabled}
                  fullWidth={true}
                  loading={loading}
                  {...(confirmColor ? { color: confirmColor } : null)}
                />
              )}
              {cancelText && <BaseButton label={cancelText} onClick={onCancel || onClose} disabled={loading || cancelDisabled} fullWidth={true} variant="outlined" />}
            </>
          ) : (
            <>
              {cancelText && <BaseButton label={cancelText} onClick={onCancel || onClose} disabled={loading || cancelDisabled} fullWidth={false} variant="outlined" />}
              {confirmText && (
                <BaseButton
                  label={confirmText}
                  onClick={onConfirm}
                  disabled={loading || confirmDisabled}
                  fullWidth={false}
                  loading={loading}
                  {...(confirmColor ? { color: confirmColor } : null)}
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
