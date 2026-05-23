"use client";
import { getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
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
import Typography from "@mui/material/Typography";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const params: Record<string, any> = { limit: 50 };
  if (search) params.search = search;

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/admin/user", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const users: any[] = data?.data ?? [];

  const handleBanToggle = async (id: string, isBanned: boolean) => {
    setLoading(true);
    const endpoint = isBanned ? `/api/admin/user/${id}/unban` : `/api/admin/user/${id}/ban`;
    await patchFetcher(endpoint, {});
    await mutate();
    setLoading(false);
  };

  return (
    <PageContainer title="Users" description="Manage all users">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Users</Typography>
        <TextField
          size="small"
          placeholder="Search username or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 280 }}
        />
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
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
              : users.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6}><Typography color="text.secondary">No users found</Typography></TableCell>
                </TableRow>
              )
              : users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Avatar src={user.profilePictureUrl ?? undefined} sx={{ width: 36, height: 36 }} />
                  </TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>@{user.username}</TableCell>
                  <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    {user.bannedAt
                      ? <Chip label="Banned" color="error" size="small" />
                      : <Chip label="Active" color="success" size="small" />
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.bannedAt ? "success" : "error"}
                      disabled={loading}
                      onClick={() => handleBanToggle(user.id, !!user.bannedAt)}
                    >
                      {user.bannedAt ? "Unban" : "Ban"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
