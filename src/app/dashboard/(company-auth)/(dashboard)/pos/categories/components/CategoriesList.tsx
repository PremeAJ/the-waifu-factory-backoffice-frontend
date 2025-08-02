"use client";
import React, { useState, useMemo } from "react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  IconEdit,
  IconEye,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import BaseTable from "@/common/components/base/BaseTable"; // <--- Import

function CategoriesList() {
  const { categories, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const filteredData = useMemo(
    () => {
      const allCategories = categories.flatMap((cat) => [
        { ...cat, subItems: cat.subCategories },
        ...cat.subCategories.map((sub) => ({ ...sub, parentId: cat.id })),
      ]);

      return categories
        .filter(
          (cat) =>
            cat.nameTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.nameEn || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((cat) => ({ ...cat, subItems: cat.subCategories }));
    },
    [categories, searchTerm]
  );

  const headers = [
    { key: "nameTh", label: "Name (TH)", align: "center" as const },
    { key: "nameEn", label: "Name (EN)", align: "center" as const },
    {
      key: "isActive",
      label: "Active",
      align: "center" as const,
      render: (isActive: boolean) => (
        <Chip
          label={isActive ? "Active" : "Inactive"}
          color={isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  const tableActions = (item: any) => (
    <>
      <Tooltip title="Edit">
        <IconButton
          component={Link}
          href={`/dashboard/pos/categories/edit/${item.id}`}
          color="primary"
        >
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
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ endAdornment: <IconSearch size={16} /> }}
        />
        {selectedItems.length > 0 && (
          <Button
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            startIcon={<IconTrash width={18} />}
          >
            Delete ({selectedItems.length})
          </Button>
        )}
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/pos/categories/create"
        >
          New Category
        </Button>
      </Stack>

      <BaseTable
        headers={headers}
        data={filteredData}
        actions={tableActions}
        enableSelection={true}
        onSelectionChange={setSelectedItems}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected categories?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoriesList;