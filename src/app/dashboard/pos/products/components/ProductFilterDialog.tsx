"use client";
import { Box, Grid } from "@mui/material";
import { OptionType } from "@/common/components/base/BaseDropdown";
import { statusOptions, isLowStockOptions } from "../constants/filterOptions";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseChip from "@/common/components/base/BaseChip";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseNumberField from "@/common/components/base/BaseNumberField";
import FilterDialog from "@/common/components/dialogs/FilterDialog";
import { useMemo } from "react";
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
  // ✅ หยิบ searchParams เองจาก URL
  const searchParams = useSearchParams();
  const filters = parseSearchParamsToFilters(searchParams);
  
  const { dropdown: categoryDropdown } = useCategories();

  // ✅ เปลี่ยน handleApply - ส่ง filters ที่อัพเดทแล้ว
  const handleApply = (updatedFilters: FilterValues) => {
    onApply(updatedFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      status: undefined,
      categoryId: "",
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isLowStock: undefined,
    };
    onApply(resetFilters);
    onClose();
  };

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

  // ✅ สร้าง wrapper function สำหรับแต่ละ field เพื่อหยิบค่าใหม่
  const handleStatusChange = (newValue: any) => {
    handleApply({ ...filters, status: newValue });
  };

  const handleCategoryChange = (newValue: any) => {
    handleApply({ ...filters, categoryId: newValue || "" });
  };

  const handleMinPriceChange = (e: any) => {
    const val = e.target.value;
    handleApply({ 
      ...filters, 
      minPrice: val === "" || val === null || val === undefined ? undefined : Number(val) 
    });
  };

  const handleMaxPriceChange = (e: any) => {
    const val = e.target.value;
    handleApply({ 
      ...filters, 
      maxPrice: val === "" || val === null || val === undefined ? undefined : Number(val) 
    });
  };

  const handleStockMinChange = (e: any) => {
    const val = e.target.value;
    handleApply({ 
      ...filters, 
      stockMin: val === "" || val === null || val === undefined ? undefined : Number(val) 
    });
  };

  const handleStockMaxChange = (e: any) => {
    const val = e.target.value;
    handleApply({ 
      ...filters, 
      stockMax: val === "" || val === null || val === undefined ? undefined : Number(val) 
    });
  };

  const handleIsLowStockChange = (newValue: any) => {
    handleApply({ ...filters, isLowStock: newValue });
  };

  return (
    <FilterDialog 
      open={open} 
      onClose={onClose}
      // ✅ ไม่มี handleApply ใน onApply แล้ว เพราะเราเรียก onApply ตรงใน handleApply
      onApply={() => onClose()}
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
