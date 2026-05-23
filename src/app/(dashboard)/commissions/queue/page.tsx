"use client";
import { getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useSWR from "swr";

const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
  pending: "warning",
  accepted: "info",
  in_progress: "info",
  done: "success",
  cancelled: "error",
};

const QUEUE_STATUSES = ["pending", "accepted", "in_progress", "done", "cancelled"];

export default function CommissionsQueuePage() {
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/admin/commission/queue", { limit: 50 }],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const items: any[] = data?.data ?? [];

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    await patchFetcher(`/api/commission/queue/${id}`, { status: newStatus });
    await mutate();
    setLoading(false);
  };

  return (
    <PageContainer title="Commission Queue" description="All commission queue entries">
      <Typography variant="h4" mb={3}>Commission Queue</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Slot / Artist</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Queued</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : error
              ? (
                <TableRow>
                  <TableCell colSpan={4}><Typography color="error">Failed to load data</Typography></TableCell>
                </TableRow>
              )
              : items.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={4}><Typography color="text.secondary">No queue entries found</Typography></TableCell>
                </TableRow>
              )
              : items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={item.client?.profilePictureUrl} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2">{item.client?.displayName ?? "—"}</Typography>
                        <Typography variant="caption" color="text.secondary">@{item.client?.username}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={item.commissionOpen?.artist?.profilePictureUrl} sx={{ width: 24, height: 24 }} />
                      <Box>
                        <Typography variant="body2">{item.commissionOpen?.title ?? "—"}</Typography>
                        <Typography variant="caption" color="text.secondary">@{item.commissionOpen?.artist?.username}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={item.status}
                      disabled={loading}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      renderValue={(v) => <Chip label={v} color={STATUS_COLOR[v] ?? "default"} size="small" />}
                      sx={{ minWidth: 140 }}
                    >
                      {QUEUE_STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>
                          <Chip label={s} color={STATUS_COLOR[s] ?? "default"} size="small" />
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
