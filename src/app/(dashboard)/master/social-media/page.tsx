"use client";
import { useSocialMedias } from "@/common/hooks/useMasterData";
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

export default function SocialMediaPage() {
  const { socialMedias, isLoading, error } = useSocialMedias();

  return (
    <PageContainer title="Social Media" description="Manage social media platforms">
      <Typography variant="h4" mb={3}>Social Media</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              : error
              ? (
                <TableRow>
                  <TableCell colSpan={2}><Typography color="error">Failed to load data</Typography></TableCell>
                </TableRow>
              )
              : socialMedias.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={2}><Typography color="text.secondary">No social media found</Typography></TableCell>
                </TableRow>
              )
              : socialMedias.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Avatar src={item.iconUrl} variant="rounded" sx={{ width: 32, height: 32 }} />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
