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

export default function CommissionsOpensPage() {
  const { data, isLoading, error } = useSWR(
    ["/api/commission/open", { limit: 50 }],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const items: any[] = data?.data ?? [];

  return (
    <PageContainer title="Open Commission Slots" description="Commission slots open for booking">
      <Typography variant="h4" mb={3}>Open Commission Slots</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist</TableCell>
              <TableCell>Slots</TableCell>
              <TableCell>Min Price</TableCell>
              <TableCell>Max Price</TableCell>
              <TableCell>Queue</TableCell>
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
                  <TableCell colSpan={6}><Typography color="error">Failed to load data</Typography></TableCell>
                </TableRow>
              )
              : items.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6}><Typography color="text.secondary">No open slots found</Typography></TableCell>
                </TableRow>
              )
              : items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={item.artist?.profilePictureUrl} sx={{ width: 32, height: 32 }} />
                      {item.artist?.displayName ?? item.artist?.username ?? "—"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${item.slotCount ?? 0} slots`} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{item.minPrice != null ? `$${item.minPrice}` : "—"}</TableCell>
                  <TableCell>{item.maxPrice != null ? `$${item.maxPrice}` : "—"}</TableCell>
                  <TableCell>{item._count?.queue ?? 0}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
