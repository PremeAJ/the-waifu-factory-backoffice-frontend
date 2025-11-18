import { defaultPageOptions } from "@/common/interface/paginate";
import { getColumnWidth } from "./util";
import { RenderLoadingRowsProps } from "./interface";
import { Skeleton, TableCell, TableRow } from "@mui/material";

export const renderLoadingRows = ({
  headers,
  enableSelection,
  hasActions,
  pagination,
}: RenderLoadingRowsProps) => {
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
        <TableCell
          size="small"
          key={header.key}
          align={header.align || "left"}
          sx={getColumnWidth(header)}
        >
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
