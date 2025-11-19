"use client";
import { Box, Grid } from "@mui/material";
import { OptionType } from "@/common/components/base/BaseDropdown";
import { statusOptions, isLowStockOptions } from "../constants/filterOptions";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseChip from "@/common/components/base/BaseChip";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseNumberField from "@/common/components/base/BaseNumberField";
import FilterDialog from "@/common/components/dialogs/FilterDialog";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { parseSearchParamsToFilters } from "@/common/contexts/ProductsContext/util";

interface FilterValues {
  status?: "all" | "active" | "inactive" | "deleted";
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  stockMin?: number;
  stockMax?: number;
  isLowStock?: boolean;
  search?: string;
}

interface ProductFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

const ProductFilterDialog: React.FC<ProductFilterDialogProps> = ({ 
  open, 
  onClose, 
  onApply
}) => {
  const searchParams = useSearchParams();
  const currentFilters = parseSearchParamsToFilters(searchParams);
  const [filters, setFilters] = useState<FilterValues>(currentFilters);
  const { dropdown: categoryDropdown } = useCategories();

  useEffect(() => {
    if (open) {
      setFilters(currentFilters);
    }
  }, [open]);
  const handleApply = useCallback(() => {
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  const handleReset = useCallback(() => {
    const resetFilters: FilterValues = {
      status: undefined,
      categoryId: "",
      minPrice: undefined,
      maxPrice: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isLowStock: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  }, [onApply, onClose]);

  const handleClose = useCallback(() => {
    setFilters(currentFilters);
    onClose();
  }, [currentFilters, onClose]);

  const categoryOptions: OptionType[] = useMemo(() => {
    if (!categoryDropdown) return [];
    const opts: OptionType[] = [];

    categoryDropdown.forEach((cat: any) => {
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

  const handleStatusChange = useCallback((newValue: any) => {
    setFilters((prev) => ({ ...prev, status: newValue }));
  }, []);

  const handleCategoryChange = useCallback((newValue: any) => {
    setFilters((prev) => ({ ...prev, categoryId: newValue || "" }));
  }, []);

  const handleMinPriceChange = useCallback((e: any) => {
    const val = e.target.value;
    setFilters((prev) => ({ 
      ...prev, 
      minPrice: val === "" || val === null || val === undefined ? undefined : Number(val) 
    }));
  }, []);

  const handleMaxPriceChange = useCallback((e: any) => {
    const val = e.target.value;
    setFilters((prev) => ({ 
      ...prev, 
      maxPrice: val === "" || val === null || val === undefined ? undefined : Number(val) 
    }));
  }, []);

  const handleStockMinChange = useCallback((e: any) => {
    const val = e.target.value;
    setFilters((prev) => ({ 
      ...prev, 
      stockMin: val === "" || val === null || val === undefined ? undefined : Number(val) 
    }));
  }, []);

  const handleStockMaxChange = useCallback((e: any) => {
    const val = e.target.value;
    setFilters((prev) => ({ 
      ...prev, 
      stockMax: val === "" || val === null || val === undefined ? undefined : Number(val) 
    }));
  }, []);

  const handleIsLowStockChange = useCallback((newValue: any) => {
    setFilters((prev) => ({ ...prev, isLowStock: newValue }));
  }, []);

  return (
    <FilterDialog 
      open={open} 
      onClose={handleClose}
      onApply={handleApply}
      onReset={handleReset} 
      title="Filter Products"
    >
      <Grid container spacing={2}>
        <Grid size={{ md: 6, xs: 12 }}>
          <BaseDropdown
            name="status"
            label="สถานะ"
            options={statusOptions}
            value={filters.status || "all"}
            onChange={handleStatusChange}
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
            onChange={handleCategoryChange}
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
            onChange={handleMinPriceChange}
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
            onChange={handleMaxPriceChange}
            suffix="฿"
            maximumFractionDigits={2}
            minimumFractionDigits={0}
            allowDecimal={true}
            allowNegative={false}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <BaseNumberField
            name="stockMin"
            label="สต็อกต่ำสุด"
            placeholder="0"
            value={filters.stockMin ?? ""}
            onChange={handleStockMinChange}
            maximumFractionDigits={0}
            minimumFractionDigits={0}
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <BaseNumberField
            name="stockMax"
            label="สต็อกสูงสุด"
            placeholder="9,999,999"
            value={filters.stockMax ?? ""}
            onChange={handleStockMaxChange}
            maximumFractionDigits={0}
            minimumFractionDigits={0}
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BaseDropdown
            name="isLowStock"
            label="สต็อก"
            options={isLowStockOptions}
            value={filters.isLowStock ?? false}
            onChange={handleIsLowStockChange}
          />
        </Grid>
      </Grid>
    </FilterDialog>
  );
};

export default ProductFilterDialog;
