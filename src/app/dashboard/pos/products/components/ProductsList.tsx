"use client";
import { BaseButton, BaseDialog, BaseFloatingButton, BaseSearchField, BaseTable, BaseTextField } from "@/common/components/base";
import { Box, Stack } from "@mui/material";
import { getProductHeaders } from "../constants/productHeaders";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";

function ProductsList() {
  const { loading, products, search, setSearch, pageOptions, setPage, setPerPage, deleteProduct } = useProducts();
  const [deleteDialogState, setDeleteDialogState] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;
  const router = useRouter();

  const tableData: any = useMemo(() => {
    return (products || []).map((prod) => {
      if (!prod.variant && prod.productOptions?.length === 1) {
        const singleOption = prod.productOptions[0];
        return {
          ...prod,
          ...singleOption,
          id: prod.id,
          subItems: [],
        };
      }

      return {
        ...prod,
        subItems: (prod.productOptions || []).map((opt) => ({
          ...opt,
          parentNameTh: prod.nameTh,
          unit: prod.unit,
        })),
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
        type: "edit",
        tooltip: "แก้ไข",
        onClick: (item: any) => router.push(`/dashboard/pos/products/edit?id=${item.id}`),
      },
      {
        type: "delete",
        tooltip: (item: any) => (item?.subItems?.length > 0 ? "ไม่สามารถลบได้ เนื่องจากมีตัวเลือกย่อย" : "ลบ"),
        disabled: (item: any) => !!(item?.subItems?.length > 0),
        onClick: (item: any) => setDeleteDialogState({ open: true, item: item }),
      },
    ],
    [isMobilePortrait, router]
  );

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} justifyContent={"space-between"}>
        {isMobile ? (
          <BaseSearchField value={search} onSearchChange={setSearch} />
        ) : (
          <BaseTextField
            fullWidth={false}
            name="search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            type="search"
          />
        )}

        {isMobile ? (
          <BaseFloatingButton preset="create" href="/dashboard/pos/products/create" />
        ) : (
          <BaseButton variant="contained" href="/dashboard/pos/products/create" fullWidth={false} preset="add" label="Add Product" />
        )}
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
    </Box>
  );
}

export default ProductsList;
