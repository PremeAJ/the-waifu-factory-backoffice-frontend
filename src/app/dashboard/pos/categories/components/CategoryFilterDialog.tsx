"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import { CategoryStatus } from "@/common/contexts/CategoriesContext/interfaces/categories";
import { IconAdjustmentsAlt } from "@tabler/icons-react";

interface FilterValues {
  status: CategoryStatus | "all";
}

interface CategoryFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const CategoryFilterDialog: React.FC<CategoryFilterDialogProps> = ({ open, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState<FilterValues>(currentFilters);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    onApply({ status: "all" });
    onClose();
  };

  const statusOptions = [
    { value: "all", text: "ทั้งหมด" },
    { value: "active", text: "เปิดใช้งาน" },
    { value: "inactive", text: "ปิดใช้งาน" },
    { value: "deleted", text: "ถูกลบ" },
  ];

  return (
    <BaseDialog
      icon={<IconAdjustmentsAlt size={50} color={theme.palette.primary.main} />}
      open={open}
      title="Filter Categories"
      content={
        <Box>
          <Grid size={{ xs: 12 }}>
            <BaseDropdown
              name="status"
              label="สถานะ"
              options={statusOptions}
              value={filters.status}
              onChange={(newValue) => setFilters({ ...filters, status: newValue as FilterValues["status"] })}
            />
          </Grid>
        </Box>
      }
      confirmText="Apply"
      cancelText="Reset"
      onConfirm={handleApply}
      onClose={handleReset}
    />
  );
};

export default CategoryFilterDialog;
