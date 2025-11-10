"use client";
import React from "react";
import { useTheme } from "@mui/material";
import { IconFilter } from "@tabler/icons-react";
import { BaseDialog } from "../base";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  children: React.ReactNode;
  title?: string;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ 
  open, 
  onApply, 
  onReset, 
  children,
  title = "Filter"
}) => {
  const theme = useTheme();

  return (
    <BaseDialog
      icon={<IconFilter size={50} color={theme.palette.primary.main} />}
      open={open}
      title={title}
      content={children}
      confirmText="Apply"
      cancelText="Reset"
      onConfirm={onApply}
      onClose={onReset}
      showCloseButton
    />
  );
};

export default FilterDialog;