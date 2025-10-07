"use client";
import { Box, IconButton, Stack } from "@mui/material";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useRouter } from "next/navigation";
import BaseButton from "@/common/components/base/BaseButton";
import BaseChip from "@/common/components/base/BaseChip"; // เพิ่ม import
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseFloatingButton from "@/common/components/base/BaseFloatingButton";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BaseTable from "@/common/components/base/BaseTable";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseTooltip from "@/common/components/base/BaseTooltip";
import ProductDialog from "./ProductDialog";
import React, { useState, useMemo } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";

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

  const headers: any = [
    {
      key: "sku",
      label: "SKU / UPC",
      align: "left",
      width: "20%",
      primary: true,
      render: (_val: any, item: any) => item.sku ?? item.upc ?? "-",
    },
    {
      key: "nameTh",
      label: "Name (TH)",
      align: "center",
      width: "20%",
      render: (_val: any, item: any) => (item.parentNameTh ? item.variantOption?.nameTh || item.parentNameTh : item.nameTh),
    },
    {
      key: "price",
      label: "Price",
      align: "center",
      width: "15%",
      render: (_val: any, item: any) => (typeof item.price === "number" ? item.price : "-"),
    },
    {
      key: "stock",
      label: "Stock",
      align: "center",
      width: "10%",
      render: (_val: any, item: any) => {
        if (typeof item.totalStock === "number") return `${item.totalStock} ${item.unit || ""}`;
        if (item.inventory?.stock !== undefined) return `${item.inventory.stock} ${item.unit || ""}`;
        return "-";
      },
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      width: "20%",
      render: (_val: any, item: any) => {
        const s = item.status ?? item.inventory?.status;
        return s ? <BaseChip preset={s} /> : "-";
      },
    },
  ];

  const tableActions = (item: any) => {
    return (
      <>
        <BaseTooltip title="แก้ไข">
          <IconButton
            onClick={() => {
              setDialogState({
                open: true,
                type: "edit",
                categoryId: item.id,
              });
            }}
            color={isMobilePortrait ? "inherit" : "primary"}
          >
            <IconEdit width={22} />
          </IconButton>
        </BaseTooltip>
        <BaseTooltip title={item?.subItems?.length > 0 ? "ไม่สามารถลบได้ เนื่องจากมีหมวดหมู่ย่อย" : "ลบ"}>
          <span>
            <IconButton
              disabled={item?.subItems?.length > 0}
              onClick={() => {
                setSelectedItems([item.id]);
                setOpenDeleteDialog(true);
              }}
              color="error"
              style={item?.subItems?.length > 0 ? { pointerEvents: "none" } : undefined}
            >
              <IconTrash width={22} />
            </IconButton>
          </span>
        </BaseTooltip>
      </>
    );
  };

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

  const onClickAdd = () => {
    router.push("products/add");
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
          <BaseFloatingButton icon={<IconPlus />} onClick={() => onClickAdd()} />
        ) : (
          <BaseButton variant="contained" onClick={() => onClickAdd()} fullWidth={false} preset="add" label="Add Product" />
        )}
      </Stack>
      <BaseTable
        loading={loading}
        headers={headers}
        data={tableData}
        actions={tableActions}
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
        content="Are you sure you want to delete the selected categories?"
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        open={openDeleteDialog}
        title="Confirm Delete"
      />
    </Box>
  );
}

export default ProductsList;
