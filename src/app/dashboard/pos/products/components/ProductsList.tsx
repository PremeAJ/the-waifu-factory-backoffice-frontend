"use client";
import { Box, Stack } from "@mui/material";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useRouter } from "next/navigation";
import BaseButton from "@/common/components/base/BaseButton";
import BaseChip from "@/common/components/base/BaseChip";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseFloatingButton from "@/common/components/base/BaseFloatingButton";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BaseTable from "@/common/components/base/BaseTable";
import BaseTextField from "@/common/components/base/BaseTextField";
import React, { useState, useMemo } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";
import { getProductHeaders } from "../constants/productHeaders";
import ProductDialog from "./ProductDialog";

type DialogState = {
  open: boolean;
  type: "create" | "edit";
  categoryId?: string | null;
};

function ProductsList() {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: "create", categoryId: null });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { loading, products, search, setSearch, pageOptions, setPage, setPerPage, deleteProduct } = useProducts();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;
  const router = useRouter();

  const tableData: any = useMemo(() => {
    return (products || []).map((prod) => ({
      ...prod,
      subItems: (prod.productOptions || []).map((opt) => ({
        ...opt,
        parentNameTh: prod.nameTh,
        unit: prod.unit,
      })),
    }));
  }, [products]);

  const headers = useMemo(() => getProductHeaders(), []);

  const actionTemplates = useMemo(
    () => [
      {
        key: "edit",
        type: "edit",
        icon: <IconEdit width={18} />,
        tooltip: "แก้ไข",
        color: isMobilePortrait ? "inherit" : "primary",
        onClick: (item: any) =>
          setDialogState({
            open: true,
            type: "edit",
            categoryId: item.id,
          }),
      },
      {
        key: "delete",
        type: "delete",
        icon: <IconTrash width={18} />,
        tooltip: (item: any) => (item?.subItems?.length > 0 ? "ไม่สามารถลบได้ เนื่องจากมีหมวดหมู่ย่อย" : "ลบ"),
        color: "error",
        disabled: (item: any) => !!(item?.subItems?.length > 0),
        onClick: (item: any) => {
          setSelectedItems([item.id]);
          setOpenDeleteDialog(true);
        },
      },
    ],
    [isMobilePortrait]
  );

  const handleConfirmDelete = async () => {
    for (const id of selectedItems) {
      await deleteProduct(id);
    }
    setSelectedItems([]);
    setOpenDeleteDialog(false);
  };

  const handleCloseDialog = () => {
    setDialogState({
      open: false,
      type: "create",
      categoryId: null,
    });
  };

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
          </Stack>
        )}

        {isMobile ? (
          <BaseFloatingButton preset="create" href="/dashboard/pos/products/create"/>
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

      <ProductDialog open={dialogState.open} onClose={handleCloseDialog} type={dialogState.type} categoryId={dialogState.categoryId} />
      <BaseDialog
        loading={loading}
        cancelText="Cancel"
        confirmColor="error"
        confirmText="Delete"
        content="Are you sure you want to delete the selected products?"
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        open={openDeleteDialog}
        title="Confirm Delete"
      />
    </Box>
  );
}

export default ProductsList;
