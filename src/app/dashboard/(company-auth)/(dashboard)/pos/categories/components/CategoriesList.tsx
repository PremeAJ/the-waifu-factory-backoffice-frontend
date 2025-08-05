"use client";
import { Box, Chip, IconButton, Link, Stack, Tooltip } from "@mui/material";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseButton from "@/common/components/base/BaseButton";
import BaseFloatingButton from "@/common/components/base/BaseFloatingButton";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BaseTable from "@/common/components/base/BaseTable";
import BaseTextField from "@/common/components/base/BaseTextField";
import React, { useState, useMemo } from "react";
import router from "next/router";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import BaseDialog from "@/common/components/base/BaseDialog";

function CategoriesList() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { categories, deleteCategory } = useCategories();
  const isMobile = useIsMobile();

  const filteredData: any = useMemo(() => {
    if (!searchTerm) {
      return categories.map((cat) => ({ ...cat, subItems: cat.subCategories }));
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return categories
      .map((cat) => {
        const parentMatches =
          cat.nameTh.toLowerCase().includes(lowercasedSearchTerm) || (cat.nameEn || "").toLowerCase().includes(lowercasedSearchTerm);

        const matchingSubCategories = cat.subCategories.filter(
          (sub) => sub.nameTh.toLowerCase().includes(lowercasedSearchTerm) || (sub.nameEn || "").toLowerCase().includes(lowercasedSearchTerm)
        );

        if (parentMatches) {
          return { ...cat, subItems: cat.subCategories };
        }

        if (matchingSubCategories.length > 0) {
          return { ...cat, subItems: matchingSubCategories };
        }

        return null;
      })
      .filter(Boolean);
  }, [categories, searchTerm]);

  const headers: any = [
    { key: "nameTh", label: "Name (TH)", align: "center" },
    { key: "nameEn", label: "Name (EN)", align: "center" },
    { key: "isActive", label: "Active", align: "center",
      render: (isActive: boolean) => <Chip label={isActive ? "Active" : "Inactive"} color={isActive ? "success" : "default"} size="small" />,
    },
  ];

  const tableActions = (item: any) => (
    <>
      <Tooltip title="Edit">
        <IconButton component={Link} href={`/dashboard/pos/categories/edit/${item.id}`} color="primary">
          <IconEdit width={22} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          onClick={() => {
            setSelectedItems([item.id]);
            setOpenDeleteDialog(true);
          }}
          color="error"
        >
          <IconTrash width={22} />
        </IconButton>
      </Tooltip>
    </>
  );

  const handleConfirmDelete = async () => {
    for (const id of selectedItems) {
      await deleteCategory(id);
    }
    setSelectedItems([]);
    setOpenDeleteDialog(false);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} justifyContent={"space-between"}>
        {isMobile ? (
          <BaseSearchField value={searchTerm} onSearchChange={setSearchTerm} />
        ) : (
          <BaseTextField
            fullWidth={false}
            name="search"
            placeholder="Search categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            type="search"
          />
        )}

        {isMobile ? (
          <BaseFloatingButton icon={<IconPlus />} onClick={() => router.push("/dashboard/pos/categories/create")} />
        ) : (
          <BaseButton variant="contained" href="/dashboard/pos/categories/create" fullWidth={false} preset="add" label="Add Category" />
        )}
      </Stack>
      <BaseTable headers={headers} data={filteredData} actions={tableActions} enableSelection={false} />
      <BaseDialog
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
