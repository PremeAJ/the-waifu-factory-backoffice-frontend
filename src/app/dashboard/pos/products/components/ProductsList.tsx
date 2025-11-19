"use client";
import { Badge, Box, Stack } from "@mui/material";
import { BaseButton, BaseDialog, BaseFloatingButton, BaseSearchField, BaseTable, BaseTextField } from "@/common/components/base";
import { ChangeEvent, useEffect, useMemo, useState, useRef } from "react";
import { debounce } from "@/common/utils/debounce";
import { getProductHeaders } from "../constants/productHeaders";
import { handleApplyFilterUtil, handleInitSearchParamsUtil, handlePageChangeUtil, handleRowsPerPageChangeUtil, handleSearchChangeUtil } from "./util";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
import { ProductType } from "@/common/contexts/ProductsContext/interfaces/products";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useProfile } from "@/common/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/common/contexts/setting/config";
import ProductFilterDialog from "./ProductFilterDialog";
import ProductPreviewDialog from "./ProductPreviewDialog";
import StockEditDialog from "./StockEditDialog";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";

function ProductsList() {
  const currentSearchParams = useSearchParams();
  const router = useRouter();
  // ✅ เพิ่ม loadMore, isLoadingMore, isReachingEnd
  const { loading, products, pageOptions, deleteProduct, filters, loadMore, isLoadingMore, isReachingEnd } = useProducts();
  const [searchInput, setSearchInput] = useState<string>("");
  const [deleteDialogState, setDeleteDialogState] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [previewState, setPreviewState] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [stockEditState, setStockEditState] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isLanguage = useProfile().appearance.isLanguage;
  const isMobilePortrait = isMobile && isPortrait;

  const debouncedSearch = useRef(
    debounce((value: string) => {
      handleSearchChangeUtil(currentSearchParams, value, router.push);
    }, 500)
  ).current;

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.categoryId) count++;
    if (filters.minPrice !== undefined && filters.minPrice !== null) count++;
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) count++;
    if (filters.stockMin !== undefined && filters.stockMin !== null) count++;
    if (filters.stockMax !== undefined && filters.stockMax !== null) count++;
    if (filters.isLowStock) count++;
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
          lowStockThreshold: singleOption.lowStockThreshold || 3,
          subItems: [],
        };
      }

      const subItems: any[] = (prod.productOptions || []).map((opt: any) => ({
        ...opt,
        nameTh: `${I18nString(isLanguage, prod.variant?.nameTh, prod.variant?.nameEn)} : ${I18nString(
          isLanguage,
          opt.variantOption.nameTh,
          opt.variantOption.nameEn
        )}`,
        unit: prod.unit,
        categories: prod.categories,
        lowStockThreshold: opt.lowStockThreshold || 3,
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
        lowStockThreshold: prod.productOptions?.[0]?.lowStockThreshold || 3,
      };
    });
  }, [products, isLanguage]);

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
        type: "edit",
        hide: (item: any) => !item.subItems,
        href: (item: any) => `/dashboard/pos/products/edit?id=${item.id}`,
      },
      {
        type: "package",
        hide: (item: any) => item.variant,
        onClick: (item: any) => setStockEditState({ open: true, item }),
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
    handlePageChangeUtil(currentSearchParams, newPage, router.push);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const perPage = parseInt(event.target.value, 10);
    handleRowsPerPageChangeUtil(currentSearchParams, perPage, router.push);
  };

  const handleApplyFilter = (newFilters: any) => {
    handleApplyFilterUtil(currentSearchParams, newFilters, router.push);
  };

  const handlePreviewVariant = (variant: any) => {
    const variantItem = {
      ...variant,
      id: variant.id,
      nameTh: variant.variantOption?.nameTh ?? variant.sku ?? "-",
      parentNameTh: previewState.item?.nameTh,
      unit: previewState.item?.unit,
      categories: previewState.item?.categories,
      subItems: [],
      productFiles: variant.productFiles,
      sku: variant.sku,
      upc: variant.upc,
    };
    setPreviewState({ open: true, item: variantItem });
  };

  const handleClosePreview = () => setPreviewState({ open: false, item: null });
  const handleCloseStockEdit = () => setStockEditState({ open: false, item: null });

  const handleSaveStock = (updatedStock: number) => {
    handleCloseStockEdit();
  };

  useEffect(() => {
    handleInitSearchParamsUtil(currentSearchParams, config, router.push);
  }, []);

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} justifyContent={"space-between"}>
        {isMobile ? (
          <BaseSearchField value={searchInput} onSearchChange={handleSearchChange} />
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <BaseTextField
              fullWidth={false}
              name="search"
              placeholder="Search products"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
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

        {isMobile && <BaseFloatingButton preset="filter" onClick={() => setOpenFilterDialog(true)} badgeContent={activeFilterCount} />}
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
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        isReachingEnd={isReachingEnd}
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

      <ProductPreviewDialog open={previewState.open} onClose={handleClosePreview} item={previewState.item} onPreviewVariant={handlePreviewVariant} />
      <StockEditDialog open={stockEditState.open} onClose={handleCloseStockEdit} item={stockEditState.item} onSave={handleSaveStock} />
    </Box>
  );
}

export default ProductsList;
