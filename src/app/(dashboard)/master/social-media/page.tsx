"use client";
import { deleteFetcher, getFetcher, postFetcher, putFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";

interface SocialMedia {
  id: string;
  name: string;
  iconUrl: string;
}

export default function SocialMediaPage() {
  const { data, isLoading, error, mutate } = useSWR("/api/master/social-media", getFetcher, { revalidateOnFocus: false });
  const items: SocialMedia[] = Array.isArray(data) ? data : (data?.data ?? []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialMedia | null>(null);
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIconUrl("");
    setDialogOpen(true);
  };

  const openEdit = (item: SocialMedia) => {
    setEditing(item);
    setName(item.name);
    setIconUrl(item.iconUrl);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    if (editing) {
      await putFetcher(`/api/admin/master/social-media/${editing.id}`, { name, iconUrl });
    } else {
      await postFetcher("/api/admin/master/social-media", { name, iconUrl });
    }
    await mutate();
    setDialogOpen(false);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social media?")) return;
    setLoading(true);
    await deleteFetcher(`/api/admin/master/social-media/${id}`, {});
    await mutate();
    setLoading(false);
  };

  return (
    <PageContainer title="Social Media" description="Manage social media platforms">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Social Media</Typography>
        <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={openCreate}>Add</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              : error
              ? (
                <TableRow>
                  <TableCell colSpan={3}><Typography color="error">Failed to load data</Typography></TableCell>
                </TableRow>
              )
              : items.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={3}><Typography color="text.secondary">No social media found</Typography></TableCell>
                </TableRow>
              )
              : items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell><Avatar src={item.iconUrl} variant="rounded" sx={{ width: 32, height: 32 }} /></TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(item)}>
                        <IconEdit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" disabled={loading} onClick={() => handleDelete(item.id)}>
                        <IconTrash size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Social Media" : "Add Social Media"}</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. X (Twitter)"
            />
            <TextField
              label="Icon URL"
              fullWidth
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://cdn.simpleicons.org/x"
              helperText="Use simpleicons.org URL for best results"
            />
            {iconUrl && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Avatar src={iconUrl} variant="rounded" sx={{ width: 32, height: 32 }} />
                <Typography variant="body2" color="text.secondary">Preview</Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!name || !iconUrl || loading} onClick={handleSave}>
            {editing ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
