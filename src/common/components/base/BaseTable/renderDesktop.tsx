import { Fragment } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { DataItem,DesktopTableProps } from "./interface";
import { getColumnWidth, renderCell } from "./util";
import { renderActionButtons } from "./renderActions";
import { renderEmptyState } from "./renderEmpty";
import { renderLoadingRows } from "./renderLoading";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";



export const renderDesktopTable = ({
  headers,
  data,
  loading,
  enableSelection,
  selectedItems,
  openRows,
  hasActions,
  pagination,
  actionTemplates,
  actions,
  onToggleRow,
  onSelectItem,
  onSelectAll,
  theme,
}: DesktopTableProps<any>) => {
  const renderRow = (item: DataItem, isSubItem = false) => (
    <TableRow key={item.id} hover sx={isSubItem ? { backgroundColor: "rgba(0, 0, 0, 0.02)" } : {}}>
      <TableCell size="small" padding="none" sx={{ width: 40 }} align="center">
        {!isSubItem && item.subItems && item.subItems.length > 0 && (
          <IconButton size="small" onClick={() => onToggleRow(item.id)}>
            {openRows[item.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
      </TableCell>
      {enableSelection && (
        <TableCell size="small" padding="checkbox">
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onChange={() => onSelectItem(item.id)}
          />
        </TableCell>
      )}
      {headers.map((header:any) => (
        <TableCell
          size="small"
          key={header.key}
          align={header.align || "left"}
          sx={getColumnWidth(header)}
        >
          {renderCell(header, item)}
        </TableCell>
      ))}
      {hasActions ? (
        <TableCell size="small" sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pr: 2 }}>
          {renderActionButtons({ item, actionTemplates, actions })}
        </TableCell>
      ) : null}
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
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {headers.map((header:any) => (
                <TableCell
                  size="small"
                  key={header.key}
                  align={header.align || "left"}
                  sx={{ ...getColumnWidth(header), border: 0 }}
                >
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
              ? renderLoadingRows({
                  headers,
                  enableSelection,
                  hasActions,
                  pagination,
                })
              : data.length === 0
              ? renderEmptyState({ headers, enableSelection, hasActions })
              : data.map((item) => (
                  <Fragment key={item.id}>
                    {renderRow(item)}
                    {openRows[item.id] && item.subItems?.map((subItem) => renderRow(subItem, true))}
                  </Fragment>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
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
