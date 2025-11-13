"use client";

import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";
import { useProfile } from "@/common/contexts/ProfileContext";
import BaseTooltip from "./BaseTooltip";
import { IconEdit, IconPlus, IconTrash, IconEye, IconPackage } from "@tabler/icons-react";
import config from "@/common/contexts/setting/config";
import { defaultPageOptions } from "@/common/interface/paginate";
import Link from "next/link"; // เพิ่ม

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
  hide?: boolean | ((item: DataItem) => boolean);
  color?: "inherit" | "primary" | "error" | "default" | "secondary" | "info" | "success" | "warning" | string;
  disabled?: (item: DataItem) => boolean;
  href?: string | ((item: DataItem) => string); // เพิ่ม
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
  actionTemplates?: ActionTemplate[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  isReachingEnd?: boolean;
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
  actionTemplates,
  onLoadMore,
  isLoadingMore,
  isReachingEnd,
}: BaseTableProps<T>) => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;
  const { isCardShadow, activeMode } = useProfile().appearance;

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && onLoadMore) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);

  const noDataText = "ไม่พบข้อมูล";
  const noDataSubtext = "ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเฟรชหน้าใหม่";

  const cardBoxShadow = isCardShadow
    ? activeMode === "dark"
      ? "0 6px 18px -6px rgba(255, 255, 255, 0.14)"
      : theme.shadows?.[1] ?? "0 1px 3px rgba(0,0,0,0.08)"
    : "none";

  const hasActions = (actionTemplates && actionTemplates.length > 0) || !!actions;


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

  const renderLoadingRows = () => {
    const skeletonCount = pagination?.rowsPerPage || defaultPageOptions.perPage;
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

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={headers.length + (enableSelection ? 1 : 0) + (hasActions ? 1 : 0) + 1} align="center" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {noDataText}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {noDataSubtext}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  const defaultActionTemplates: Record<string, Partial<ActionTemplate>> = {
    create: {
      type: "create",
      icon: <IconPlus />,
      color: "success",
    },
    edit: {
      type: "edit",
      icon: <IconEdit />,
      color: "warning",
    },
    package:{
      type: "package",
      icon: <IconPackage/>,
      color: "success"
    },
    delete: {
      type: "delete",
      icon: <IconTrash />,
      color: "error",
    },
    view: {
      type: "view",
      icon: <IconEye />,
      color: "info",
    },
  };

  const renderActionButtons = (item: DataItem) => {
    if (actionTemplates && actionTemplates.length > 0) {
      return (
        <>
          {actionTemplates.map((tpl, idx) => {
            const defaults = tpl.type ? defaultActionTemplates[tpl.type] || {} : {};
            const resolved: ActionTemplate = { ...(defaults as ActionTemplate), ...(tpl as ActionTemplate) };
            const isHidden = typeof resolved.hide === "function" ? resolved.hide(item) : resolved.hide;
            if (isHidden) return null;
            const disabled = resolved.disabled ? resolved.disabled(item) : false;
            const tooltipText = typeof resolved.tooltip === "function" ? resolved.tooltip(item) : resolved.tooltip || "";
            const href = typeof resolved.href === "function" ? resolved.href(item) : resolved.href; // ใหม่
            return (
              <Box key={resolved.key ?? `${resolved.type ?? "action"}-${idx}`} sx={{ display: "inline-flex", mx: 0.5 }}>
                <BaseTooltip title={tooltipText}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={disabled}
                      {...(!disabled && href ? { component: Link, href } : {})} // ถ้ามี href ใช้ Link
                      onClick={!href ? () => resolved.onClick?.(item) : undefined}
                      color={resolved.color as any}
                    >
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
        <TableCell size="small" sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pr: 2 }}>
          {renderActionButtons(item)}
        </TableCell>
      ) : null}
    </TableRow>
  );

  if (isMobilePortrait) {
    const primaryHeader = headers.find((h: any) => h.primary === true) || headers[0];

    if (loading) {
      const skeletonCount = pagination?.rowsPerPage || defaultPageOptions.perPage;
      return (
        <Stack spacing={2}>
          {Array.from({ length: skeletonCount }).map((_, si) => (
            <Box
              key={`mobile-skel-${si}`}
              sx={{
                p: 0,
                boxShadow: cardBoxShadow,
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

    if (data.length === 0 && !loading) { 
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {noDataText}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {noDataSubtext}
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {data.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 0,
              boxShadow: cardBoxShadow,
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
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      justifyContent="space-between" 
                      key={header.key} 
                      my={1}
                      spacing={2}
                    >
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700, flexShrink: 0 }}>
                        {header.label}
                      </Typography>
                      <Box sx={{ textAlign: "right", flexGrow: 1 }}>
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
                    justifyContent: "flex-end",
                    alignSelf: "center",
                    mr: 2,
                  }}
                >
                  {renderActionButtons(item)}
                </Box>
              )}
            </Box>
            {/* divider between main and subitems when expanded */}
            {openRows[item.id] && item.subItems?.length && item.subItems.length > 0 ? <Divider sx={{ my: 1 }} /> : null}

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
                            <Stack 
                              direction="row" 
                              alignItems="center" 
                              justifyContent="space-between" 
                              key={header.key} 
                              my={1}
                              spacing={2}
                            >
                              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700, flexShrink: 0 }}>
                                {header.label}
                              </Typography>
                              <Box sx={{ textAlign: "right", flexGrow: 1 }}>
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
                            justifyContent: "flex-end",
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
        {/* --- ส่วนของ Infinite Scroll --- */}
        <Box ref={ref} sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          {isLoadingMore && <CircularProgress />}
          {isReachingEnd && data.length > 0 && !isLoadingMore && (
            <Typography variant="caption" color="text.secondary">
              ไม่มีข้อมูลเพิ่มเติม
            </Typography>
          )}
        </Box>
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
              : data.length === 0
              ? renderEmptyState()
              : data.map((item) => ( 
                  <React.Fragment key={item.id}>
                    {renderRow(item)}
                    {openRows[item.id] && item.subItems?.map((subItem) => renderRow(subItem, true))}
                  </React.Fragment>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!isMobilePortrait && pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={pagination.page} 
          onPageChange={pagination.onPageChange}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          disabled={loading}
        />
      )}
    </Box>
  );
};

export default BaseTable;
