"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Checkbox,
  TableContainer,
  Paper,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// --- Interfaces ---
interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number; // เพิ่ม width prop
  render?: (value: any, row: DataItem) => React.ReactNode;
}

interface DataItem extends Record<string, any> {
  id: string;
  subItems?: DataItem[];
}

interface BaseTableProps<T extends readonly TableHeader[]> {
  headers: T;
  data: DataItem[];
  actions?: (item: DataItem) => React.ReactNode;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

// --- Component ---
const BaseTable = <T extends readonly TableHeader[]>({ headers, data, actions, enableSelection = false, onSelectionChange }: BaseTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const theme = useTheme();
  const paginatedData = useMemo(() => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [data, page, rowsPerPage]);

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id: string) => {
    const newSelected = selectedItems.includes(id) ? selectedItems.filter((item) => item !== id) : [...selectedItems, id];
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = event.target.checked ? data.map((item) => item.id) : [];
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  // Helper function สำหรับสร้าง sx props สำหรับ width
  const getColumnWidth = (header: TableHeader) => ({
    ...(header.width && { width: header.width }),
    ...(typeof header.width === "string" && header.width.includes("%") && { width: header.width }),
    ...(typeof header.width === "number" && { width: `${header.width}px` }),
  });

  const renderCell = (header: TableHeader, item: DataItem) => {
    if (header.render) {
      return header.render(item[header.key], item);
    }
    return item[header.key];
  };

  const renderRow = (item: DataItem, isSubItem = false) => (
    <TableRow key={item.id} hover sx={isSubItem ? { backgroundColor: "rgba(0, 0, 0, 0.02)" } : {}}>
      <TableCell size="small" align="center">
        {!isSubItem && item.subItems && item.subItems.length > 0 && (
          <IconButton size="small" onClick={() => toggleRow(item.id)}>
            {openRows[item.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
      </TableCell>
      {enableSelection && (
        <TableCell size="small" padding="checkbox">
          <Checkbox checked={selectedItems.includes(item.id)} onChange={() => handleSelect(item.id)} />
        </TableCell>
      )}
      {headers.map((header) => (
        <TableCell
          size="small"
          key={header.key}
          align={header.align || "left"}
          sx={{
            ...getColumnWidth(header),
            ...(isSubItem && header.key === headers[0].key && { pl: 4 }),
          }}
        >
          {renderCell(header, item)}
        </TableCell>
      ))}
      {actions && (
        <TableCell size="small" align="center">
          {actions(item)}
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              bgcolor: theme.palette.primary.main,
              "& .MuiTableCell-root": {
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
              },
              "& .MuiCheckbox-root": {
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            <TableRow>
              <TableCell size="small" padding="none" sx={{ width: 40, border: 0 }} />
              {enableSelection && (
                <TableCell size="small" padding="checkbox" sx={{ border: 0 }}>
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
                    checked={data.length > 0 && selectedItems.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {headers.map((header) => (
                <TableCell size="small" key={header.key} align={header.align || "left"} sx={{ ...getColumnWidth(header), border: 0 }}>
                  {header.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell size="small" align="center" sx={{ border: 0 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <React.Fragment key={item.id}>
                {renderRow(item)}
                {/* Sub-rows */}
                {openRows[item.id] && item.subItems?.map((subItem) => renderRow(subItem, true))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default BaseTable;
