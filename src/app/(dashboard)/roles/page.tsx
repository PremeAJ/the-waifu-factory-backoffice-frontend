"use client";
import { getFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

export default function RolesPage() {
  const { data, isLoading, error } = useSWR("/api/roles", getFetcher, { revalidateOnFocus: false });

  const items: any[] = data?.data ?? [];

  return (
    <PageContainer title="Roles & Permissions" description="Manage roles and permissions">
      <Typography variant="h4" mb={3}>Roles & Permissions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
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
                  <TableCell colSpan={4}><Typography color="text.secondary">No roles found</Typography></TableCell>
                </TableRow>
              )
              : items.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell><Typography fontWeight={600}>{role.name}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5} flexWrap="wrap">
                      {(role.permissions ?? []).map((p: any, i: number) => {
                        const label = typeof p === "string" ? p : (p?.name ?? p?.action ?? p?.id ?? String(i));
                        return <Chip key={`${role.id}-${label}-${i}`} label={label} size="small" color="primary" variant="outlined" />;
                      })}
                    </Stack>
                  </TableCell>
                  <TableCell>{role._count?.users ?? 0}</TableCell>
                  <TableCell>{role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
