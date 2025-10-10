"use client";
import { Box, IconButton, Stack } from "@mui/material";
import { IconEdit, IconFilter, IconPlus, IconTrash } from "@tabler/icons-react";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useState, useMemo, ChangeEvent } from "react";
import BaseButton from "@/common/components/base/BaseButton";
import BaseChip from "@/common/components/base/BaseChip"; // เพิ่ม import
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseFloatingButton, { FloatingButtonPosition } from "@/common/components/base/BaseFloatingButton";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BaseTable from "@/common/components/base/BaseTable";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseTooltip from "@/common/components/base/BaseTooltip";
import CategoryDialog from "./CategoryDialog";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";
import { CategoryStatus } from "@/common/contexts/CategoriesContext/interfaces/categories";

type DialogState = {
  open: boolean;
  type: "create" | "edit";
  categoryId?: string | null;
};

function CategoriesList() {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: "create", categoryId: null });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { loading, categories, search, setSearch, isActive, setIsActive, pageOptions, setPage, setPerPage, deleteCategory } = useCategories();
  const { isLanguage } = useProfile().appearance || {};
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;
  const tableData: any = useMemo(() => {
    return categories.map((cat) => ({ ...cat, subItems: cat.subCategories }));
  }, [categories]);

  const headers: any = [
    {
      key: "icon",
      label: "Icon",
      align: "center",
      width: "10%",
      render: (iconName: string) => (iconName ? renderTablerIcon(iconName) : "-"),
    },
    {
      key: "nameTh",
      label: "Name (TH)",
      align: "left",
      width: "25%",
      render: (value: string) => value || "-",
      ...(isLanguage === "th" ? { primary: true } : {}),
    },
    {
      key: "nameEn",
      label: "Name (EN)",
      align: "left",
      width: "25%",
      render: (value: string) => value || "-",
      ...(isLanguage === "en" ? { primary: true } : {}),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      width: "20%",
      render: (status: CategoryStatus) => <BaseChip preset={status} />,
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
      await deleteCategory(id);
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

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
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
              placeholder="Search categories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300 }}
              type="search"
            />
          </Stack>
        )}

        {isMobile ? (
          <BaseFloatingButton
            position={FloatingButtonPosition.BOTTOM_RIGHT}
            icon={<IconPlus />}
            onClick={() => setDialogState({ open: true, type: "create" })}
          />
        ) : (
          <BaseButton
            variant="contained"
            onClick={() => setDialogState({ open: true, type: "create" })}
            fullWidth={false}
            preset="add"
            label="Add Category"
          />
        )}

        {isMobile && (
          <BaseFloatingButton
            position={FloatingButtonPosition.TOP_RIGHT}
            icon={<IconFilter />}
            onClick={() => setDialogState({ open: true, type: "create" })}
          />
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
      <CategoryDialog open={dialogState.open} onClose={handleCloseDialog} type={dialogState.type} categoryId={dialogState.categoryId} />
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

export default CategoriesList;
