"use client";
import { getFetcher } from "@/app/api/globalFetcher";
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

type AdoptableStatus = "pending" | "open" | "closed" | "resell" | "deleted";

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  pending: "warning",
  open: "success",
  closed: "default",
  resell: "info",
  deleted: "error",
};

interface Props {
  status?: AdoptableStatus;
}

export default function AdoptablesTable({ status }: Props) {
  const params: Record<string, any> = { limit: 50 };
  if (status) params.status = status;

  const { data, isLoading, error } = useSWR(
    ["/api/adoptable", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const items: any[] = data?.data ?? [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Created</TableCell>
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
                <TableCell colSpan={6}>
                  <Typography color="error">Failed to load data</Typography>
                </TableCell>
              </TableRow>
            )
            : items.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No adoptables found</Typography>
                </TableCell>
              </TableRow>
            )
            : items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Avatar src={item.thumbnailUrl ?? item.imageUrl} variant="rounded" sx={{ width: 48, height: 48 }} />
                </TableCell>
                <TableCell>{item.title ?? "—"}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={item.artist?.profilePictureUrl} sx={{ width: 24, height: 24 }} />
                    {item.artist?.displayName ?? item.artist?.username ?? "—"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={item.status} color={STATUS_COLOR[item.status] ?? "default"} size="small" />
                </TableCell>
                <TableCell>{item.price != null ? `$${item.price}` : "—"}</TableCell>
                <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
