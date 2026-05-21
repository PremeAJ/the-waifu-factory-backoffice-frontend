"use client";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconArrowsSort } from "@tabler/icons-react";

export type SortByOption = "newest" | "oldest" | "price_asc" | "price_desc";

export interface AdoptableSortBarProps {
  sortBy: SortByOption;
  onSortChange: (v: SortByOption) => void;
}

const AdoptableSortBar: React.FC<AdoptableSortBarProps> = ({ sortBy, onSortChange }) => (
  <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={2.5} gap={1}>
    <IconArrowsSort size={16} />
    <Typography variant="body2" color="text.secondary">Sort by</Typography>
    <Select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as SortByOption)}
      size="small"
      sx={{ minWidth: 160, borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 } }}
    >
      <MenuItem value="newest">Newest first</MenuItem>
      <MenuItem value="oldest">Oldest first</MenuItem>
      <MenuItem value="price_asc">Price: Low to High</MenuItem>
      <MenuItem value="price_desc">Price: High to Low</MenuItem>
    </Select>
  </Stack>
);

export default AdoptableSortBar;
