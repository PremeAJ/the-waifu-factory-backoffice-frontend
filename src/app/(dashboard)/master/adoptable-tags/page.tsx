"use client";
import { deleteFetcher, getFetcher, postFetcher, putFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconEdit, IconPlus, IconTag, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";

interface TagItem {
  id: string;
  name: string;
  color: string | null;
}

interface TagCategory {
  id: string;
  name: string;
  color: string | null;
  tags: TagItem[];
}

type DialogMode =
  | { type: "create-category" }
  | { type: "edit-category"; item: TagCategory }
  | { type: "create-tag"; categoryId: string }
  | { type: "edit-tag"; item: TagItem; categoryId: string }
  | null;

export default function AdoptableTagsPage() {
  const { data, isLoading, error, mutate } = useSWR("/api/master/adoptable-tags", getFetcher, { revalidateOnFocus: false });
  const categories: TagCategory[] = Array.isArray(data) ? data : (data?.data ?? []);

  const [dialog, setDialog] = useState<DialogMode>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const openDialog = (mode: DialogMode) => {
    setDialog(mode);
    if (!mode) return;
    if (mode.type === "edit-category") {
      setName(mode.item.name);
      setColor(mode.item.color ?? "");
    } else if (mode.type === "edit-tag") {
      setName(mode.item.name);
      setColor(mode.item.color ?? "");
    } else {
      setName("");
      setColor("");
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setName("");
    setColor("");
  };

  const handleSave = async () => {
    if (!dialog) return;
    setLoading(true);
    const colorVal = color || null;

    if (dialog.type === "create-category") {
      await postFetcher("/api/admin/master/tag-categories", { name, color: colorVal });
    } else if (dialog.type === "edit-category") {
      await putFetcher(`/api/admin/master/tag-categories/${dialog.item.id}`, { name, color: colorVal });
    } else if (dialog.type === "create-tag") {
      await postFetcher("/api/admin/master/tags", { name, color: colorVal, categoryId: dialog.categoryId });
    } else if (dialog.type === "edit-tag") {
      await putFetcher(`/api/admin/master/tags/${dialog.item.id}`, { name, color: colorVal, categoryId: dialog.categoryId });
    }

    await mutate();
    closeDialog();
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its tags?")) return;
    setLoading(true);
    await deleteFetcher(`/api/admin/master/tag-categories/${id}`, {});
    await mutate();
    setLoading(false);
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    setLoading(true);
    await deleteFetcher(`/api/admin/master/tags/${id}`, {});
    await mutate();
    setLoading(false);
  };

  const dialogTitle = () => {
    if (!dialog) return "";
    if (dialog.type === "create-category") return "Add Category";
    if (dialog.type === "edit-category") return "Edit Category";
    if (dialog.type === "create-tag") return "Add Tag";
    return "Edit Tag";
  };

  return (
    <PageContainer title="Adoptable Tags" description="Manage adoptable tags and categories">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Adoptable Tags</Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus size={16} />}
          onClick={() => openDialog({ type: "create-category" })}
        >
          Add Category
        </Button>
      </Stack>

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Paper key={i} sx={{ p: 2, mb: 2 }}>
              <Skeleton width={120} height={28} sx={{ mb: 1 }} />
              <Stack direction="row" gap={1}>
                {Array.from({ length: 4 }).map((__, j) => <Skeleton key={j} width={60} height={24} />)}
              </Stack>
            </Paper>
          ))
        : error
        ? <Typography color="error">Failed to load data</Typography>
        : categories.length === 0
        ? <Typography color="text.secondary">No categories found</Typography>
        : categories.map((cat) => (
            <Paper key={cat.id} sx={{ mb: 2, overflow: "hidden" }}>
              <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "grey.50" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  {cat.color && (
                    <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: cat.color, flexShrink: 0 }} />
                  )}
                  <Typography fontWeight={600}>{cat.name}</Typography>
                  <Typography variant="caption" color="text.secondary">({cat.tags.length} tags)</Typography>
                </Stack>
                <Stack direction="row" gap={0.5}>
                  <Tooltip title="Add Tag">
                    <IconButton size="small" color="primary" onClick={() => openDialog({ type: "create-tag", categoryId: cat.id })}>
                      <IconTag size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Category">
                    <IconButton size="small" onClick={() => openDialog({ type: "edit-category", item: cat })}>
                      <IconEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Category">
                    <IconButton size="small" color="error" disabled={loading} onClick={() => handleDeleteCategory(cat.id)}>
                      <IconTrash size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                {cat.tags.length === 0
                  ? <Typography variant="body2" color="text.secondary">No tags yet</Typography>
                  : (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {cat.tags.map((tag) => (
                        <Box key={tag.id} display="flex" alignItems="center" gap={0.5}>
                          <Chip
                            label={tag.name}
                            size="small"
                            sx={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}
                          />
                          <Tooltip title="Edit">
                            <IconButton size="small" sx={{ p: 0.25 }} onClick={() => openDialog({ type: "edit-tag", item: tag, categoryId: cat.id })}>
                              <IconEdit size={12} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" sx={{ p: 0.25 }} disabled={loading} onClick={() => handleDeleteTag(tag.id)}>
                              <IconTrash size={12} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}
                    </Stack>
                  )}
              </Box>
            </Paper>
          ))}

      <Dialog open={!!dialog} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogTitle()}</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dialog?.type?.includes("category") ? "e.g. Species" : "e.g. Kitsune"}
            />
            <Stack direction="row" alignItems="center" gap={2}>
              <TextField
                label="Color (optional)"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#FF6B6B"
                sx={{ flex: 1 }}
              />
              {color && (
                <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: color, border: "1px solid", borderColor: "divider" }} />
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" disabled={!name || loading} onClick={handleSave}>
            {dialog?.type?.startsWith("edit") ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
