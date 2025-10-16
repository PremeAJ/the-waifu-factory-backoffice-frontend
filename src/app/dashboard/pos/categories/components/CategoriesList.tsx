"use client";
import { Box, Stack } from "@mui/material";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useState, useMemo, ChangeEvent } from "react";
import BaseButton from "@/common/components/base/BaseButton";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseFloatingButton, { FloatingButtonPosition } from "@/common/components/base/BaseFloatingButton";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BaseTable from "@/common/components/base/BaseTable";
import BaseTextField from "@/common/components/base/BaseTextField";
import CategoryDialog from "./CategoryDialog";
import useIsMobile from "@/common/utils/state/isMobile";
import { getCategoryHeaders } from "../constants/categoryHeaders";

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
  const tableData: any = useMemo(() => {
    return categories.map((cat) => ({ ...cat, subItems: cat.subCategories }));
  }, [categories]);
  const headers = useMemo(() => getCategoryHeaders(isLanguage), [isLanguage]);
  const actionTemplates = [
    {
      type: "edit",
      tooltip: "แก้ไข",
      onClick: (item: any) =>
        setDialogState({
          open: true,
          type: "edit",
          categoryId: item.id,
        }),
    },
    {
      type: "delete",
      tooltip: (item: any) => (item?.subItems?.length > 0 ? "ไม่สามารถลบได้ เนื่องจากมีหมวดหมู่ย่อย" : "ลบ"),
      disabled: (item: any) => !!(item?.subItems?.length > 0),
      onClick: (item: any) => {
        setSelectedItems([item.id]);
        setOpenDeleteDialog(true);
      },
    },
  ];

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
