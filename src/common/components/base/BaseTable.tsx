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
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";
import { useProfile } from "@/common/contexts/ProfileContext";
import BaseTooltip from "./BaseTooltip";
// add default action icons
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";

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

type ActionTemplate = {
  key?: string;
  type?: string;
  icon?: React.ReactNode;
  tooltip?: string | ((item: DataItem) => string);
  color?: "inherit" | "primary" | "error" | "default" | "secondary" | "info" | "success" | "warning" | string;
  disabled?: (item: DataItem) => boolean;
  onClick?: (item: DataItem) => void;
};

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
  rowHeaderColor?: "primary" | "success" | "error";
  actionTemplates?: ActionTemplate[]; // template-driven actions (merged with defaults below)
}

const BaseTable = <T extends readonly TableHeader[]>({
  headers,
  data,
  actions,
  enableSelection = false,
  onSelectionChange,
  loading = false,
  pagination,
  rowHeaderColor,
  actionTemplates, // added
}: BaseTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;
  const { isCardShadow } = useProfile().appearance;

  // consider either legacy actions prop or new actionTemplates
  const hasActions = (actionTemplates && actionTemplates.length > 0) || !!actions;

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
        {hasActions && (
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
      <TableCell colSpan={headers.length + (enableSelection ? 1 : 0) + (hasActions ? 1 : 0) + 1} align="center" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box sx={{ color: "text.secondary", fontSize: "1.2rem" }}>ไม่พบข้อมูล</Box>
          <Box sx={{ color: "text.disabled", fontSize: "0.875rem" }}>ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเฟรชหน้าใหม่</Box>
        </Box>
      </TableCell>
    </TableRow>
  );

  // default templates (can be overridden by provided actionTemplates entries)
  const defaultActionTemplates: Record<string, Partial<ActionTemplate>> = {
    add: {
      type: "add",
      icon: <IconPlus />,
      tooltip: "Add",
      color: "primary",
    },
    edit: {
      type: "edit",
      icon: <IconEdit />,
      tooltip: "Edit",
      color: "primary",
    },
    delete: {
      type: "delete",
      icon: <IconTrash />,
      tooltip: "Delete",
      color: "error",
    },
    view: {
      type: "view",
      icon: <IconEye />,
      tooltip: "View",
      color: "info",
    },
  };

  const renderActionButtons = (item: DataItem) => {
    if (actionTemplates && actionTemplates.length > 0) {
      return (
        <>
          {actionTemplates.map((tpl, idx) => {
            // merge defaults for tpl.type with provided tpl (provided tpl overrides defaults)
            const defaults = tpl.type ? defaultActionTemplates[tpl.type] || {} : {};
            const resolved: ActionTemplate = { ...(defaults as ActionTemplate), ...(tpl as ActionTemplate) };

            const disabled = resolved.disabled ? resolved.disabled(item) : false;
            const tooltipText = typeof resolved.tooltip === "function" ? resolved.tooltip(item) : resolved.tooltip || "";
            return (
              <Box key={resolved.key ?? `${resolved.type ?? "action"}-${idx}`} sx={{ display: "inline-flex", mx: 0.5 }}>
                <BaseTooltip title={tooltipText}>
                  <span>
                    <IconButton size="small" disabled={disabled} onClick={() => resolved.onClick?.(item)} color={resolved.color as any}>
                      {resolved.icon ?? <span style={{ fontSize: 12 }}>{resolved.type}</span>}
                    </IconButton>
                  </span>
                </BaseTooltip>
              </Box>
            );
          })}
        </>
      );
    }

    if (actions) return actions(item);
    return null;
  };

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
          }}
        >
          {renderCell(header, item)}
        </TableCell>
      ))}
      {hasActions ? (
        <TableCell size="small" align="center">
          {renderActionButtons(item)}
        </TableCell>
      ) : null}
    </TableRow>
  );

  if (isMobilePortrait) {
    const primaryHeader = headers.find((h: any) => h.primary === true) || headers[0];

    if (loading) {
      const skeletonCount = pagination?.rowsPerPage || rowsPerPage;
      return (
        <Stack spacing={2}>
          {Array.from({ length: skeletonCount }).map((_, si) => (
            <Box
              key={`mobile-skel-${si}`}
              sx={{
                p: 0,
                boxShadow: isCardShadow ? 1 : 0,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette[rowHeaderColor || "primary"].main,
                  color: theme.palette[rowHeaderColor || "primary"].contrastText,
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Skeleton variant="rectangular" width={28} height={28} />
                  <Skeleton variant="rectangular" width={28} height={28} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                <Box sx={{ px: 2, py: 1.5, width: "90%" }}>
                  {headers.map((header) => (
                    <Stack direction="row" alignItems="center" key={`${header.key}-${si}`} my={1}>
                      <Box sx={{ width: "75%" }}>
                        <Skeleton variant="text" width="40%" />
                      </Box>
                      <Box sx={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </Stack>
                  ))}
                </Box>
                <Box sx={{ width: "10%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <Skeleton variant="rectangular" width={28} height={28} />
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        {paginatedData.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 0,
              boxShadow: isCardShadow ? 1 : 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                bgcolor: theme.palette[rowHeaderColor || "primary"].main,
                color: theme.palette[rowHeaderColor || "primary"].contrastText,
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: item.subItems?.length && item.subItems.length > 0 ? "pointer" : "default",
              }}
              onClick={() => {
                if (item.subItems?.length && item.subItems.length > 0) toggleRow(item.id);
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
                {item.subItems?.length && item.subItems.length > 0 ? openRows[item.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> : null}
                <Typography fontWeight={600}>
                  {primaryHeader.render ? primaryHeader.render(item[primaryHeader.key], item) : item[primaryHeader.key]}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 0, alignItems: "stretch" }}>
              <Box sx={{ px: 2, py: 1.5, width: "90%" }}>
                {headers.map((header) => {
                  const cellValue = header.render ? header.render(item[header.key], item) : item[header.key];
                  return (
                    <Stack direction="row" alignItems="center" key={header.key} my={1}>
                      <Box sx={{ width: "75%" }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>
                          {header.label}
                        </Typography>
                      </Box>
                      <Box sx={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {typeof cellValue === "string" || typeof cellValue === "number" ? (
                          <Typography variant="body2">{cellValue}</Typography>
                        ) : (
                          cellValue
                        )}
                      </Box>
                    </Stack>
                  );
                })}
              </Box>
              {hasActions && (
                <Box
                  sx={{
                    width: "10%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    mr: 2,
                  }}
                >
                  {renderActionButtons(item)}
                </Box>
              )}
            </Box>
            {/* divider between main and subitems when expanded */}
            {openRows[item.id] && item.subItems?.length && item.subItems.length > 0 ? <Divider sx={{ my: 1, }} /> : null}

            {/* SubItems (expand) */}
            {openRows[item.id] && item.subItems?.length && item.subItems.length > 0 ? (
              <>
                {item.subItems!.map((subItem, idx) => (
                  <Box key={subItem.id} sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", gap: 0, alignItems: "flex-start", width: "100%" }}>
                      <Box sx={{ px: 2, width: "90%" }}>
                        {headers.map((header) => {
                          const cellValue = header.render ? header.render(subItem[header.key], subItem) : subItem[header.key];
                          return (
                            <Stack direction="row" alignItems="center" key={header.key} my={1}>
                              <Box sx={{ width: "75%" }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>
                                  {header.label}
                                </Typography>
                              </Box>
                              <Box sx={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {typeof cellValue === "string" || typeof cellValue === "number" ? (
                                  <Typography variant="body2">{cellValue}</Typography>
                                ) : (
                                  cellValue
                                )}
                              </Box>
                            </Stack>
                          );
                        })}
                      </Box>
                      {hasActions && (
                        <Box
                          sx={{
                            width: "10%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",
                            mr: 2,
                          }}
                        >
                          {renderActionButtons(subItem)}
                        </Box>
                      )}
                    </Box>
                    {idx < item.subItems!.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </>
            ) : null}
          </Box>
        ))}
      </Stack>
    );
  }

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
              {hasActions && (
                <TableCell size="small" align="center" sx={{ border: 0 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? renderLoadingRows()
              : paginatedData.length === 0
              ? renderEmptyState()
              : paginatedData.map((item) => (
                  <React.Fragment key={item.id}>
                    {renderRow(item)}
                    {openRows[item.id] && item.subItems?.map((subItem) => renderRow(subItem, true))}
                  </React.Fragment>
                ))}
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
