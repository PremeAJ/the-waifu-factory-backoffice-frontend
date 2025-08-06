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
  Checkbox,
  TableContainer,
  Paper,
  useTheme,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// --- Interfaces ---
interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number;
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
  loading?: boolean;
  pagination?: {
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

// --- Component ---
const BaseTable = <T extends readonly TableHeader[]>({
  headers,
  data,
  actions,
  enableSelection = false,
  onSelectionChange,
  loading = false,
  pagination,
}: BaseTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const theme = useTheme();

  // เรียก useMemo เสมอ แล้วใช้ conditional ใน assignment
  const slicedData = useMemo(() => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const paginatedData = pagination ? data : slicedData;

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

  // Render loading skeleton rows
  const renderLoadingRows = () => {
    const skeletonCount = pagination?.rowsPerPage || rowsPerPage;
    return Array.from({ length: skeletonCount }, (_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell size="small" padding="none" sx={{ width: 40 }} />
        {enableSelection && (
          <TableCell size="small" padding="checkbox">
            <Skeleton variant="rectangular" width={20} height={20} />
          </TableCell>
        )}
        {headers.map((header) => (
          <TableCell size="small" key={header.key} align={header.align || "left"} sx={getColumnWidth(header)}>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        ))}
        {actions && (
          <TableCell size="small" align="center">
            <Skeleton variant="rectangular" width={80} height={32} />
          </TableCell>
        )}
      </TableRow>
    ));
  };

  // Render empty state
  const renderEmptyState = () => (
    <TableRow>
      <TableCell
        colSpan={headers.length + (enableSelection ? 1 : 0) + (actions ? 1 : 0) + 1}
        align="center"
        sx={{ py: 8 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box sx={{ color: "text.secondary", fontSize: "1.2rem" }}>ไม่พบข้อมูล</Box>
          <Box sx={{ color: "text.disabled", fontSize: "0.875rem" }}>
            ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเฟรชหน้าใหม่
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );

  const renderRow = (item: DataItem, isSubItem = false) => (
    <TableRow key={item.id} hover sx={isSubItem ? { backgroundColor: "rgba(0, 0, 0, 0.02)" } : {}}>
      <TableCell size="small" padding="none" sx={{ width: 40 }} align="center">
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
        <Table>
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
                    disabled={loading}
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
            {loading ? (
              renderLoadingRows()
            ) : paginatedData.length === 0 ? (
              renderEmptyState()
            ) : (
              paginatedData.map((item) => (
                <React.Fragment key={item.id}>
                  {renderRow(item)}
                  {openRows[item.id] && item.subItems?.map((subItem) => renderRow(subItem, true))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={pagination?.total || data.length}
        page={pagination?.page || page}
        onPageChange={pagination?.onPageChange || ((_, newPage) => setPage(newPage))}
        rowsPerPage={pagination?.rowsPerPage || rowsPerPage}
        onRowsPerPageChange={
          pagination?.onRowsPerPageChange ||
          ((e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          })
        }
        rowsPerPageOptions={[5, 10, 25]}
        disabled={loading}
      />
    </Box>
  );
};

export default BaseTable;
