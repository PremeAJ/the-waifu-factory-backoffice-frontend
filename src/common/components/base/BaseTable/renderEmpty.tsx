import { renderNoDataMessage } from "./constants";
import { TableCell, TableRow } from "@mui/material";
import { RenderEmptyStateProps } from "./interface";

export const renderEmptyState = ({
  headers,
  enableSelection,
  hasActions,
}: RenderEmptyStateProps) => (
  <TableRow>
    <TableCell
      colSpan={
        headers.length +
        (enableSelection ? 1 : 0) +
        (hasActions ? 1 : 0) +
        1
      }
      align="center"
      sx={{ py: 8 }}
    >
      {renderNoDataMessage()}
    </TableCell>
  </TableRow>
);
