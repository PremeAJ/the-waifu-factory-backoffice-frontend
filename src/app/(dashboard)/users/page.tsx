"use client";
import { useUsers } from "@/common/hooks/useMasterData";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export default function UsersPage() {
  const { users, isLoading } = useUsers();

  return (
    <PageContainer title="Users" description="Manage all users">
      <Typography variant="h4" mb={3}>Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 3 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : users.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={3}><Typography color="text.secondary">No users found</Typography></TableCell>
                </TableRow>
              )
              : users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Avatar src={user.profilePictureUrl ?? undefined} sx={{ width: 36, height: 36 }} />
                  </TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>@{user.username}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
