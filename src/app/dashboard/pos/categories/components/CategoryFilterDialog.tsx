"use client";
import { Grid } from "@mui/material";
import { CategoryStatus } from "@/common/contexts/CategoriesContext/interfaces/categories";
import BaseChip from "@/common/components/base/BaseChip";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import React, { useState, useEffect } from "react";
import FilterDialog from "@/common/components/dialogs/FilterDialog";

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
    const resetFilters = { status: "all" as const };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  const statusOptions = [
    { value: "all", text: "ทั้งหมด" },
    { value: "active", text: "เปิดใช้งาน" },
    { value: "inactive", text: "ปิดใช้งาน" },
  ];

  return (
    <FilterDialog
      open={open}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Categories"
    >
      <Grid size={{ xs: 12 }}>
        <BaseDropdown
          name="status"
          label="สถานะ"
          options={statusOptions}
          value={filters.status}
          onChange={(newValue) => setFilters({ ...filters, status: newValue as FilterValues["status"] })}
          renderOption={(option) => <BaseChip preset={option.value} />}
        />
      </Grid>
    </FilterDialog>
  );
};

export default CategoryFilterDialog;
