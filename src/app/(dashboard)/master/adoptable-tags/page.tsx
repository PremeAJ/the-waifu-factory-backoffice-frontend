"use client";
import { useAdoptableTags } from "@/common/hooks/useMasterData";
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

export default function AdoptableTagsPage() {
  const { adoptableTags, isLoading, error } = useAdoptableTags();

  return (
    <PageContainer title="Adoptable Tags" description="Manage adoptable tags">
      <Typography variant="h4" mb={3}>Adoptable Tags</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Tags</TableCell>
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
              : adoptableTags.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={2}><Typography color="text.secondary">No tags found</Typography></TableCell>
                </TableRow>
              )
              : adoptableTags.map((cat) => (
                <TableRow key={cat.id} hover>
                  <TableCell><Typography fontWeight={600}>{cat.name}</Typography></TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5} flexWrap="wrap">
                      {cat.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          sx={tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
