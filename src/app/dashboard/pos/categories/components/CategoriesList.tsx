"use client";
import { Box, Stack, Badge } from "@mui/material";
import { CategoryStatus } from "@/common/contexts/CategoriesContext/interfaces/categories";
import { getCategoryHeaders } from "../constants/categoryHeaders";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
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
import CategoryFilterDialog from "./CategoryFilterDialog";
import useIsMobile from "@/common/utils/state/isMobile";
import config from "@/common/contexts/setting/config";

type DialogState = {
  open: boolean;
  type: "create" | "edit";
  categoryId?: string | null;
  parent?: string | null;
};

function CategoriesList() {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: "create", categoryId: null, parent: null });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { loading, categories, filters, setFilters, pageOptions, setPage, setPerPage, deleteCategory, loadMore, isLoadingMore, isReachingEnd } =
    useCategories();
  const { isLanguage } = useProfile().appearance || {};
  const isMobile = useIsMobile();

  const tableData: any = useMemo(() => {
    return categories.map((cat) => ({ ...cat, subItems: cat.subCategories }));
  }, [categories]);
  const headers = useMemo(() => getCategoryHeaders(isLanguage), [isLanguage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== "all") {
      count++;
    }
    return count;
  }, [filters.status]);

  const actionTemplates = [
    {
      type: "create",
      tooltip: "เพิ่มหมวดหมู่ย่อย",
      hide: (item: any) => item.parent,
      onClick: (item: any) => {
        setDialogState({
          open: true,
          type: "create",
          parent: item.id,
        });
      },
    },
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
    setPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleApplyFilter = (newFilters: { status: CategoryStatus | "all" }) => {
    setFilters({ status: newFilters.status });
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} justifyContent={"space-between"}>
        {isMobile ? (
          <BaseSearchField value={filters.search} onSearchChange={(val) => setFilters({ search: val })} />
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <BaseTextField
              fullWidth={false}
              name="search"
              placeholder="Search categories"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
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
          <BaseFloatingButton preset="create" onClick={() => setDialogState({ open: true, type: "create" })} />
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
            preset="filter"
            onClick={() => setOpenFilterDialog(true)}
            icon={
              <Badge badgeContent={activeFilterCount} color="error">
                <IconAdjustmentsAlt />
              </Badge>
            }
          />
        )}
      </Stack>
      <BaseTable
        loading={loading && categories.length === 0}
        headers={headers}
        data={tableData}
        actionTemplates={actionTemplates}
        enableSelection={false}
        pagination={{
          total: pageOptions.total,
          page: (pageOptions.page || config.defaultPage) - 1,
          rowsPerPage: pageOptions.perPage || config.defaultPerPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        isReachingEnd={isReachingEnd}
      />
      <CategoryDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        type={dialogState.type}
        categoryId={dialogState.categoryId}
        parent={dialogState.parent ?? undefined}
      />
      <CategoryFilterDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        onApply={handleApplyFilter}
        currentFilters={{
          status: filters.status,
        }}
      />
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
