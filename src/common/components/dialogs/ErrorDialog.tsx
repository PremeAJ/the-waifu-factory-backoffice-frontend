"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  error?: Error | string | null;
  showDetails?: boolean;
  disableBackdropClose?: boolean; // เพิ่ม prop นี้
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  onClose,
  title = "Error",
  message,
  error,
  showDetails = process.env.NODE_ENV === "development",
  disableBackdropClose = false, // เพิ่ม default
}) => {
  const getErrorMessage = () => {
    if (message) return message;
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    return "An unexpected error occurred. Please try again.";
  };

  const getErrorDetails = () => {
    if (!showDetails || !error) return null;
    if (typeof error === "object" && error.stack) {
      return error.stack;
    }
    return JSON.stringify(error, null, 2);
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      iconType="warning"
      content={
        <Box>
          <Typography variant="body1" sx={{ textAlign: "center", mb: showDetails ? 2 : 0 }}>
            {getErrorMessage()}
          </Typography>

          {showDetails && getErrorDetails() && (
            <Box
              sx={{
                backgroundColor: "grey.100",
                p: 2,
                borderRadius: 1,
                maxHeight: 200,
                overflow: "auto",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Error Details:
              </Typography>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {getErrorDetails()}
              </pre>
            </Box>
          )}
        </Box>
      }
      confirmText="ตกลง"
      onConfirm={onClose}
      confirmColor="primary"
      disableBackdropClose={disableBackdropClose}
      sx={{ zIndex: 9999 }}
    />
  );
};

export default ErrorDialog;