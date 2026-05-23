"use client";
import { deleteFetcher, getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";

type AdoptableStatus = "pending" | "open" | "rejected" | "closed" | "resell" | "deleted";

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  pending: "warning",
  open: "success",
  closed: "default",
  resell: "info",
  deleted: "error",
  rejected: "error",
};

interface Props {
  status?: AdoptableStatus;
}

export default function AdoptablesTable({ status }: Props) {
  const params: Record<string, any> = { limit: 50 };
  if (status) params.status = status;

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/admin/adoptable", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async (id: string) => {
    setLoading(true);
    await patchFetcher(`/api/admin/adoptable/${id}/approve`, {});
    await mutate();
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setLoading(true);
    await patchFetcher(`/api/admin/adoptable/${rejectId}/reject`, { rejectReason });
    setRejectId(null);
    setRejectReason("");
    await mutate();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Force delete this adoptable?")) return;
    setLoading(true);
    await deleteFetcher(`/api/admin/adoptable/${id}`, {});
    await mutate();
    setLoading(false);
  };

  const items: any[] = data?.data ?? [];
  const isPending = status === "pending";

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : error
              ? (
                <TableRow>
                  <TableCell colSpan={6}><Typography color="error">Failed to load data</Typography></TableCell>
                </TableRow>
              )
              : items.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6}><Typography color="text.secondary">No adoptables found</Typography></TableCell>
                </TableRow>
              )
              : items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Avatar src={item.thumbnailUrl ?? item.imageUrl} variant="rounded" sx={{ width: 48, height: 48 }} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={item.artist?.profilePictureUrl} sx={{ width: 24, height: 24 }} />
                      <Box>
                        <Typography variant="body2">{item.artist?.displayName ?? item.artist?.username ?? "—"}</Typography>
                        {item.artist?.username && (
                          <Typography variant="caption" color="text.secondary">@{item.artist.username}</Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.status} color={STATUS_COLOR[item.status] ?? "default"} size="small" />
                  </TableCell>
                  <TableCell>{item.price != null ? `$${item.price}` : "—"}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      {isPending && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton color="success" size="small" disabled={loading} onClick={() => handleApprove(item.id)}>
                              <IconCheck size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton color="warning" size="small" disabled={loading} onClick={() => setRejectId(item.id)}>
                              <IconX size={16} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Force Delete">
                        <IconButton color="error" size="small" disabled={loading} onClick={() => handleDelete(item.id)}>
                          <IconTrash size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!rejectId} onClose={() => { setRejectId(null); setRejectReason(""); }} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Adoptable</DialogTitle>
        <DialogContent>
          <TextField
            label="Reject Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRejectId(null); setRejectReason(""); }}>Cancel</Button>
          <Button variant="contained" color="error" disabled={!rejectReason || loading} onClick={handleReject}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
