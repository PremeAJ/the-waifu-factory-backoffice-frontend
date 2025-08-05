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
  TableContainer, // <-- Import
  Paper,          // <-- Import
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// --- Interfaces ---
interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: DataItem) => React.ReactNode; // Custom render function
}

interface DataItem extends Record<string, any> {
  id: string;
  subItems?: DataItem[];
}

interface BaseTableProps<T extends readonly TableHeader[]> { // <--- 1. เปลี่ยนเป็น Generic
  headers: T; // <--- 2. ใช้ Generic Type T
  data: DataItem[];
  actions?: (item: DataItem) => React.ReactNode;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

// --- Component ---
const BaseTable = <T extends readonly TableHeader[]>({ // <--- 3. ประกาศ Generic ที่ Component
  headers,
  data,
  actions,
  enableSelection = false,
  onSelectionChange,
}: BaseTableProps<T>) => { 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id: string) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = event.target.checked ? data.map((item) => item.id) : [];
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  const renderCell = (header: TableHeader, item: DataItem) => {
    if (header.render) {
      return header.render(item[header.key], item);
    }
    return item[header.key];
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="none" sx={{ width: 40 }} />
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
                    checked={data.length > 0 && selectedItems.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {headers.map((header) => (
                <TableCell key={header.key} align={header.align || "left"}>
                  {header.label}
                </TableCell>
              ))}
              {actions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow hover>
                  <TableCell padding="none" sx={{ width: 40 }} align="center">
                    {item.subItems && item.subItems.length > 0 && (
                      <IconButton size="small" onClick={() => toggleRow(item.id)}>
                        {openRows[item.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    )}
                  </TableCell>
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedItems.includes(item.id)} onChange={() => handleSelect(item.id)} />
                    </TableCell>
                  )}
                  {headers.map((header) => (
                    <TableCell key={header.key} align={header.align || "left"}>
                      {renderCell(header, item)}
                    </TableCell>
                  ))}
                  {actions && <TableCell align="center">{actions(item)}</TableCell>}
                </TableRow>
                {/* Sub-rows */}
                {openRows[item.id] &&
                  item.subItems?.map((subItem) => (
                    <TableRow key={subItem.id} hover sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                      <TableCell padding="none" />
                      {enableSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedItems.includes(subItem.id)} onChange={() => handleSelect(subItem.id)} />
                        </TableCell>
                      )}
                      {headers.map((header) => (
                        <TableCell key={header.key} align={header.align || "left"} sx={{ pl: header.key === headers[0].key ? 4 : undefined }}>
                          {renderCell(header, subItem)}
                        </TableCell>
                      ))}
                      {actions && <TableCell align="center">{actions(subItem)}</TableCell>}
                    </TableRow>
                  ))}
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