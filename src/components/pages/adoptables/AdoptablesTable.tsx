"use client";
import { deleteFetcher, getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import AdoptableCard, { AdoptableListItem } from "./AdoptableCard";

type AdoptableStatus = "pending" | "open" | "rejected" | "closed" | "resell" | "deleted";

interface Props {
  status?: AdoptableStatus;
}

function toListItem(raw: any): AdoptableListItem {
  return {
    id: raw.id,
    number: raw.number ?? 0,
    imageUrl: raw.imageUrl ?? "",
    thumbnailUrl: raw.thumbnailUrl,
    postUrl: raw.postUrl,
    artist: raw.artist ?? { username: "", displayName: "Unknown", profilePictureUrl: null },
    owner: raw.owner ?? raw.artist ?? { username: "", displayName: "Unknown", profilePictureUrl: null },
    status: raw.status,
    price: raw.price,
    createdAt: raw.createdAt ?? "",
    tags: raw.tags ?? [],
    isNSFW: raw.isNSFW,
    viewCount: raw.viewCount,
    likeCount: raw.likeCount,
    isLiked: raw.isLiked,
    reviewer: raw.reviewer,
    rejectReason: raw.rejectReason,
  };
}

export default function AdoptablesTable({ status }: Props) {
  const params: Record<string, any> = { limit: 50 };
  if (status) params.status = status;

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/admin/adoptable", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const { mutate: globalMutate } = useSWRConfig();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshPendingCount = () => globalMutate("/api/adoptable/pending-count");

  const handleApprove = async (id: string) => {
    setLoading(true);
    await patchFetcher(`/api/admin/adoptable/${id}/approve`, {});
    await mutate();
    refreshPendingCount();
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setLoading(true);
    await patchFetcher(`/api/admin/adoptable/${rejectId}/reject`, { rejectReason });
    setRejectId(null);
    setRejectReason("");
    await mutate();
    refreshPendingCount();
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
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Skeleton variant="rounded" sx={{ paddingTop: "120%" }} />
              <Skeleton sx={{ mt: 1 }} />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error">Failed to load data</Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No adoptables found</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((raw) => {
            const item = toListItem(raw);
            return (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <AdoptableCard
                    item={item}
                    onCardClick={() => window.open(`${process.env.NEXT_PUBLIC_CLIENT_URL}/adoptables/${item.id}`, "_blank")}
                    onArtistClick={(username) => window.open(`${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${username}`, "_blank")}
                  />
                  <Stack direction="row" justifyContent="flex-end" spacing={0.5} px={0.5}>
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
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

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
