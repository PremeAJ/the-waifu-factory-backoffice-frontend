"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ErrorDialog from "@/common/components/dialogs/ErrorDialog";
import SuccessDialog from "@/common/components/dialogs/SuccessDialog";

type DialogType = "error" | "success";

interface DialogPayload {
  message: string;
  title?: string;
  showDetails?: boolean;
  disableBackdropClose?: boolean;
  callback?: string;
}

interface DialogContextType {
  showError: (payload: DialogPayload) => void;
  showSuccess: (payload: DialogPayload) => void;
  hideDialog: () => void;
}

interface DialogState {
  open: boolean;
  type: DialogType;
  title: string;
  message: string | Error | null;
  showDetails?: boolean;
  disableBackdropClose?: boolean;
  callback?: string;
}

const DialogContext = createContext<DialogContextType>({} as DialogContextType);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    type: "error",
    title: "เกิดข้อผิดพลาด",
    message: null,
    showDetails: false,
    disableBackdropClose: false,
  });

  const showError = useCallback((payload: DialogPayload) => {
    setDialogState({
      open: true,
      type: "error",
      title: payload.title || "เกิดข้อผิดพลาด",
      message: payload.message,
      showDetails: payload.showDetails ?? false,
      disableBackdropClose: payload.disableBackdropClose ?? true,
      callback: payload.callback,
    });
  }, []);

  const showSuccess = useCallback((payload: DialogPayload) => {
    setDialogState({
      open: true,
      type: "success",
      title: payload.title || "สำเร็จ",
      message: payload.message,
      showDetails: false,
      disableBackdropClose: payload.callback ? true : payload.disableBackdropClose ? payload.disableBackdropClose : false,
      callback: payload.callback,
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <DialogContext.Provider value={{ showError, showSuccess, hideDialog }}>
      {children}
      {dialogState.type === "error" && (
        <ErrorDialog
          open={dialogState.open}
          onClose={hideDialog}
          title={dialogState.title}
          error={dialogState.message}
          showDetails={dialogState.showDetails}
          disableBackdropClose={dialogState.disableBackdropClose}
        />
      )}
      {dialogState.type === "success" && (
        <SuccessDialog
          open={dialogState.open}
          onClose={hideDialog}
          title={dialogState.title}
          message={dialogState.message as string}
          disableBackdropClose={dialogState.disableBackdropClose}
          callback={dialogState.callback}
        />
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
