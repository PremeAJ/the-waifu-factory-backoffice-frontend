"use client";
import { Badge, Box, Stack } from "@mui/material";
import { BaseButton, BaseDialog, BaseFloatingButton, BaseSearchField, BaseTable, BaseTextField } from "@/common/components/base";
import { getProductHeaders } from "../constants/productHeaders";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
import { ProductType } from "@/common/contexts/ProductsContext/interfaces/products";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useProfile } from "@/common/contexts";
import ProductFilterDialog from "./ProductFilterDialog";
import ProductPreviewDialog from "./ProductPreviewDialog";
import React, { useMemo, useState } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";

function ProductsList() {
  const { loading, products, search, setSearch, pageOptions, setPage, setPerPage, deleteProduct, filters, setFilters } = useProducts();
  const [deleteDialogState, setDeleteDialogState] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [previewState, setPreviewState] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isLanguage = useProfile().appearance.isLanguage;
  const isMobilePortrait = isMobile && isPortrait;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.categoryId) count++;
    if (filters.minPrice !== undefined && filters.minPrice !== null) count++;
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) count++;
    return count;
  }, [filters]);

  const tableData: any = useMemo(() => {
    return (products || []).map((prod: ProductType) => {
      if (!prod.variant && prod.productOptions?.length === 1) {
        const singleOption = prod.productOptions[0];
        return {
          ...prod,
          ...singleOption,
          id: prod.id,
          subItems: [],
        };
      }

      // ✅ แก้ไข: เพิ่ม categories ให้กับ subItems
      const subItems: any[] = (prod.productOptions || []).map((opt: any) => ({
        ...opt,
        nameTh: `${I18nString(isLanguage, prod.variant?.nameTh, prod.variant?.nameEn)} : ${I18nString(
          isLanguage,
          opt.variantOption.nameTh,
          opt.variantOption.nameEn
        )}`,
        unit: prod.unit,
        categories: prod.categories, // ✅ เพิ่ม: ส่ง categories จาก parent product
      }));

      const derivedStatus = subItems.some((opt: any) => {
        return (opt?.status ?? opt?.inventory?.status) === "active";
      })
        ? "active"
        : "inactive";

      const prices = subItems.map((s: any) => Number(s?.basePrice ?? s?.finalPrice ?? NaN)).filter((n: number) => !Number.isNaN(n));
      const fallbackProdPrice = Number((prod as any)?.basePrice ?? (prod as any)?.finalPrice ?? NaN);
      const priceMin = prices.length ? Math.min(...prices) : fallbackProdPrice;
      const priceMax = prices.length ? Math.max(...prices) : fallbackProdPrice;
      const priceDisplay =
        !Number.isNaN(priceMin) && !Number.isNaN(priceMax) ? (priceMin === priceMax ? String(priceMin) : `${priceMin} ~ ${priceMax}`) : "-";

      return {
        ...prod,
        id: prod.id,
        status: derivedStatus,
        basePrice: Number.isFinite(priceMin) ? priceMin : undefined,
        displayPrice: priceDisplay,
        price: priceDisplay,
        subItems,
      };
    });
  }, [products]);

  const headers = useMemo(() => getProductHeaders(), []);

  const handleConfirmDelete = async () => {
    if (deleteDialogState.item) {
      await deleteProduct(deleteDialogState.item.id);
      setDeleteDialogState({ open: false, item: null });
    }
  };

  const actionTemplates = useMemo(
    () => [
      {
        type: "view",
        // ✅ แก้ไข: แสดงปุ่ม view สำหรับทั้ง parent และ sub-items
        hide: () => false,
        onClick: (item: any) => setPreviewState({ open: true, item }),
      },
      {
        type: "edit",
        href: (item: any) => `/dashboard/pos/products/edit?id=${item.id}`,
      },
      {
        type: "delete",
        hide: (item: any) => !item.subItems,
        onClick: (item: any) => setDeleteDialogState({ open: true, item: item }),
      },
    ],
    [isMobilePortrait]
  );

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // ✅ แก้ไข: ฟังก์ชันจัดการการเปิด dialog ของ variant
  const handlePreviewVariant = (variant: any) => {
    // แปลง variant เป็น item ที่ดูเหมือน product object
    const variantItem = {
      ...variant,
      id: variant.id,
      nameTh: variant.variantOption?.nameTh ?? variant.sku ?? "-",
      parentNameTh: previewState.item?.nameTh,
      unit: previewState.item?.unit,
      categories: previewState.item?.categories, // ✅ เพิ่ม: ส่ง categories มาด้วย
      subItems: [], // variant ไม่มี sub-items
      productFiles: variant.productFiles, // ใช้ thumbnail ของ variant
      sku: variant.sku,
      upc: variant.upc,
    };
    setPreviewState({ open: true, item: variantItem });
  };

  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClosePreview = () => setPreviewState({ open: false, item: null });

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} justifyContent={"space-between"}>
        {isMobile ? (
          <BaseSearchField value={search} onSearchChange={setSearch} />
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <BaseTextField
              fullWidth={false}
              name="search"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300 }}
              type="search"
            />
            <Badge badgeContent={activeFilterCount} color="error">
              <BaseButton
                variant="outlined"
                onClick={() => setOpenFilterDialog(true)}
                fullWidth={false}
                label="Filter"
                startIcon={<IconAdjustmentsAlt size={20} />}
              />
            </Badge>
          </Stack>
        )}

        {isMobile ? (
          <BaseFloatingButton preset="create" href="/dashboard/pos/products/create" />
        ) : (
          <BaseButton variant="contained" href="/dashboard/pos/products/create" fullWidth={false} preset="add" label="Add Product" />
        )}

        {isMobile && <BaseFloatingButton preset="filter" onClick={() => setOpenFilterDialog(true)} />}
      </Stack>

      <BaseTable
        loading={loading}
        headers={headers}
        data={tableData}
        actionTemplates={actionTemplates}
        enableSelection={false}
        pagination={{
          total: pageOptions.total || 0,
          page: (pageOptions.page || 1) - 1,
          rowsPerPage: pageOptions?.perPage || 5,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
      />

      <ProductFilterDialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} onApply={handleApplyFilter} currentFilters={filters} />

      <BaseDialog
        loading={loading}
        cancelText="Cancel"
        confirmColor="error"
        confirmText="Delete"
        content={`Are you sure you want to delete "${deleteDialogState.item?.nameTh}"?`}
        onClose={() => setDeleteDialogState({ open: false, item: null })}
        onConfirm={handleConfirmDelete}
        open={deleteDialogState.open}
        title="Confirm Delete"
      />
      {/* ✅ แก้ไข: ส่ง onPreviewVariant callback ให้ ProductPreviewDialog */}
      <ProductPreviewDialog
        open={previewState.open}
        onClose={handleClosePreview}
        item={previewState.item}
        onPreviewVariant={handlePreviewVariant}
      />
    </Box>
  );
}

export default ProductsList;
