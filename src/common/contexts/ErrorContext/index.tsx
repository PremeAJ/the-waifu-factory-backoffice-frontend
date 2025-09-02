"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ErrorDialog from "@/common/components/dialogs/ErrorDialog";

interface ErrorContextType {
  showError: (error: Error | string, title?: string, showDetails?: boolean) => void;
  hideError: () => void;
}

interface ErrorState {
  open: boolean;
  title: string;
  error: Error | string | null;
  showDetails: boolean;
}

const ErrorContext = createContext<ErrorContextType>({} as ErrorContextType);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    open: false,
    title: "เกิดข้อผิดพลาด",
    error: null,
    showDetails: false,
  });

  const showError = useCallback((error: Error | string, title = "เกิดข้อผิดพลาด", showDetails = false) => {
    setErrorState({
      open: true,
      title,
      error,
      showDetails,
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      <ErrorDialog
        open={errorState.open}
        onClose={hideError}
        title={errorState.title}
        error={errorState.error}
        showDetails={errorState.showDetails}
      />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};