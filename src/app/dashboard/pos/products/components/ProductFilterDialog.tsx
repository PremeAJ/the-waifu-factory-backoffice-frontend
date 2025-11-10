"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseNumberField from "@/common/components/base/BaseNumberField";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import BaseChip from "@/common/components/base/BaseChip";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import FilterDialog from "@/common/components/dialogs/FilterDialog";

interface FilterValues {
  status?: "all" | "active" | "inactive";
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const ProductFilterDialog: React.FC<ProductFilterDialogProps> = ({ open, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState<FilterValues>(currentFilters);
  const { dropdown: categoryDropdown } = useCategories();

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
    const resetFilters = { status: "all" as const, categoryId: undefined, minPrice: undefined, maxPrice: undefined };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  const statusOptions = [
    { value: "all", text: "ทั้งหมด" },
    { value: "active", text: "เปิดใช้งาน" },
    { value: "inactive", text: "ปิดใช้งาน" },
  ];

  const categoryOptions = (categoryDropdown || []).map((cat) => ({
    value: cat.id,
    text: `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`,
    icon: cat.icon,
  }));

  return (
    <FilterDialog
      open={open}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Products"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <BaseDropdown
            name="status"
            label="สถานะ"
            options={statusOptions}
            value={filters.status || "all"}
            onChange={(newValue) => setFilters({ ...filters, status: newValue as FilterValues["status"] })}
            renderOption={(option) => <BaseChip preset={option.value as any} />}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BaseAutoComplete
            name="categoryId"
            label="หมวดหมู่"
            options={categoryOptions}
            value={filters.categoryId || ""}
            onChange={(newValue) => setFilters({ ...filters, categoryId: newValue || undefined })}
            placeholder="เลือกหมวดหมู่"
            freeSolo={false}
            clearOnEscape
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box component="li" key={key} {...otherProps} display="flex" alignItems="center" gap={1}>
                  {option.icon && renderTablerIcon(option.icon, { size: 16 })}
                  {option.text}
                </Box>
              );
            }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <BaseNumberField
            name="minPrice"
            label="ราคาต่ำสุด"
            placeholder="0"
            value={filters.minPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({ ...filters, minPrice: val === "" || val === null || val === undefined ? undefined : Number(val) });
            }}
            suffix="฿"
            maximumFractionDigits={2}
            minimumFractionDigits={0}
            allowDecimal={true}
            allowNegative={false}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <BaseNumberField
            name="maxPrice"
            label="ราคาสูงสุด"
            placeholder="9,999,999"
            value={filters.maxPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setFilters({ ...filters, maxPrice: val === "" || val === null || val === undefined ? undefined : Number(val) });
            }}
            suffix="฿"
            maximumFractionDigits={2}
            minimumFractionDigits={0}
            allowDecimal={true}
            allowNegative={false}
          />
        </Grid>
      </Grid>
    </FilterDialog>
  );
};

export default ProductFilterDialog;