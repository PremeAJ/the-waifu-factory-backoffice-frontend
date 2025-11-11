"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseNumberField from "@/common/components/base/BaseNumberField";
import BaseChip from "@/common/components/base/BaseChip";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import FilterDialog from "@/common/components/dialogs/FilterDialog";
import { OptionType } from "@/common/components/base/BaseDropdown";

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
    const resetFilters = { status: "all" as const, categoryId: "", minPrice: undefined, maxPrice: undefined };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  const statusOptions = [
    { value: "all", text: "ทั้งหมด" },
    { value: "active", text: "เปิดใช้งาน" },
    { value: "inactive", text: "ปิดใช้งาน" },
  ];

  const categoryOptions: OptionType[] = useMemo(() => {
    if (!categoryDropdown) return [];
    const opts: OptionType[] = [];

    categoryDropdown.forEach((cat: any) => {
      console.log("🚀 ~ ProductFilterDialog ~ cat:", cat);
      const parentText = `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`;
      opts.push({
        value: String(cat.id),
        text: parentText,
        icon: cat.icon || null,
        color: cat.color || null,
        group: "หมวดหมู่หลัก",
      });

      if (Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
        cat.subCategories.forEach((sub: any) => {
          opts.push({
            value: String(sub.id),
            text: `${sub.nameTh}${sub.nameEn ? ` (${sub.nameEn})` : ""}`,
            icon: sub.icon || null,
            color: sub.color || null,
            group: parentText,
          });
        });
      }
    });

    return opts;
  }, [categoryDropdown]);

  return (
    <FilterDialog open={open} onClose={onClose} onApply={handleApply} onReset={handleReset} title="Filter Products">
      <Grid container spacing={2}>
        <Grid size={{ md: 6, xs: 12 }}>
          <BaseDropdown
            name="status"
            label="สถานะ"
            options={statusOptions}
            value={filters.status || "all"}
            onChange={(newValue) => setFilters({ ...filters, status: newValue as FilterValues["status"] })}
            renderOption={(option: any) => <BaseChip preset={option.value} />}
            renderValue={(selected: any) => (
              <Box display="flex" alignItems="center" gap={1}>
                <BaseChip preset={selected} />
              </Box>
            )}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <BaseDropdown
            name="categoryId"
            label="หมวดหมู่"
            options={categoryOptions}
            value={filters.categoryId || ""}
            onChange={(newValue) => setFilters({ ...filters, categoryId: newValue || "" })}
            placeholder="เลือกหมวดหมู่"
            showEmptyOption={true}
            emptyOptionText="ทั้งหมด"
            groupBy={(opt) => (opt as any).group || ""}
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
