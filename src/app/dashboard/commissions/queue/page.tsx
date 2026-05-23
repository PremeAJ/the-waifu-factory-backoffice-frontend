"use client";
import { getFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
  pending: "warning",
  accepted: "info",
  in_progress: "info",
  done: "success",
  cancelled: "error",
};

function QueueTable({ slotId }: { slotId: string }) {
  const { data, isLoading } = useSWR(
    `/api/commission/open/${slotId}/queue`,
    getFetcher,
    { revalidateOnFocus: false }
  );
  const items: any[] = data?.data ?? [];
  if (isLoading) return <Skeleton width={80} />;
  if (items.length === 0) return <Typography variant="body2" color="text.secondary">—</Typography>;
  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      {items.map((q: any) => (
        <Box key={q.id} display="flex" alignItems="center" gap={1}>
          <Avatar src={q.client?.profilePictureUrl} sx={{ width: 24, height: 24 }} />
          <Typography variant="body2">{q.client?.displayName ?? q.client?.username ?? "—"}</Typography>
          <Chip label={q.status} color={STATUS_COLOR[q.status] ?? "default"} size="small" />
        </Box>
      ))}
    </Box>
  );
}

export default function CommissionsQueuePage() {
  const { data, isLoading, error } = useSWR(
    ["/api/commission/open", { limit: 50 }],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const slots: any[] = data?.data ?? [];

  return (
    <PageContainer title="Commission Queue" description="Queue per commission slot">
      <Typography variant="h4" mb={3}>Commission Queue</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist</TableCell>
              <TableCell>Slots</TableCell>
              <TableCell>Queue</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
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
              : slots.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={4}><Typography color="text.secondary">No open slots found</Typography></TableCell>
                </TableRow>
              )
              : slots.map((slot) => (
                <TableRow key={slot.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={slot.artist?.profilePictureUrl} sx={{ width: 32, height: 32 }} />
                      {slot.artist?.displayName ?? slot.artist?.username ?? "—"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${slot.slotCount ?? 0} slots`} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <QueueTable slotId={slot.id} />
                  </TableCell>
                  <TableCell>{slot.createdAt ? new Date(slot.createdAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
