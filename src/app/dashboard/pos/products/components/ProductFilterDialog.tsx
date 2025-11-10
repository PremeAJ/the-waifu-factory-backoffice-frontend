"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import { IconAdjustmentsAlt, IconFilter } from "@tabler/icons-react";
import BaseChip from "@/common/components/base/BaseChip";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

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
  const theme = useTheme();
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
    onApply({ status: "all", categoryId: undefined, minPrice: undefined, maxPrice: undefined });
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
    <BaseDialog
      icon={<IconFilter size={50} color={theme.palette.primary.main} />}
      open={open}
      title="Filter Products"
      content={
        <Box>
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
              <BaseTextField
                name="minPrice"
                label="ราคาต่ำสุด"
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <BaseTextField
                name="maxPrice"
                label="ราคาสูงสุด"
                type="number"
                placeholder="9999999"
                value={filters.maxPrice ?? ""}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              />
            </Grid>
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

export default ProductFilterDialog;