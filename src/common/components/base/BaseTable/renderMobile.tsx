import { Box, CircularProgress, Divider, Skeleton, Stack, Typography, } from "@mui/material";
import { defaultPageOptions } from "@/common/interface/paginate";
import { Fragment } from "react";
import { MobileTableProps, MobileCardItemProps, MobileSubItemContentProps, MobileLoadingSkeletonProps } from "./interface";
import { renderActionButtons } from "./renderActions";
import { renderCell } from "./util";
import { renderNoDataMessage, TABLE_CONSTANTS, COLUMN_WIDTH } from "./constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const renderMobileTable = ({
  headers,
  data,
  loading,
  openRows,
  hasActions,
  cardBoxShadow,
  rowHeaderColor = "primary",
  actionTemplates,
  actions,
  pagination,
  isLoadingMore,
  isReachingEnd,
  scrollRef,
  onToggleRow,
  theme,
}: MobileTableProps<any>) => {
  const primaryHeader = headers.find((h: any) => h.primary === true) || headers[0];

  // Loading state
  if (loading) {
    const skeletonCount = pagination?.rowsPerPage || defaultPageOptions.perPage;
    return (
      <Stack spacing={2}>
        {Array.from({ length: skeletonCount }).map((_, si) => (
          <MobileLoadingSkeleton
            key={`mobile-skel-${si}`}
            headers={headers}
            cardBoxShadow={cardBoxShadow}
            rowHeaderColor={rowHeaderColor}
            theme={theme}
          />
        ))}
      </Stack>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 8 }}>
        {renderNoDataMessage()}
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((item) => (
        <MobileCardItem
          key={item.id}
          item={item}
          headers={headers}
          primaryHeader={primaryHeader}
          openRows={openRows}
          cardBoxShadow={cardBoxShadow}
          rowHeaderColor={rowHeaderColor}
          hasActions={hasActions}
          actionTemplates={actionTemplates}
          actions={actions}
          onToggleRow={onToggleRow}
          theme={theme}
        />
      ))}

      {/* Infinite scroll trigger */}
      <Box ref={scrollRef} sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        {isLoadingMore && <CircularProgress />}
        {isReachingEnd && data.length > 0 && !isLoadingMore && (
          <Typography variant="caption" color="text.secondary">
            {TABLE_CONSTANTS.NO_MORE_DATA_TEXT}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};



const MobileLoadingSkeleton = ({
  headers,
  cardBoxShadow,
  rowHeaderColor,
  theme,
}: MobileLoadingSkeletonProps) => (
  <Box
    sx={{
      p: 0,
      boxShadow: cardBoxShadow,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        bgcolor: theme.palette[rowHeaderColor].main,
        color: theme.palette[rowHeaderColor].contrastText,
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
      <Box sx={{ px: 2, py: 1.5, width: COLUMN_WIDTH.MOBILE_CONTENT }}>
        {headers.map((header) => (
          <Stack direction="row" alignItems="center" key={`${header.key}`} my={1}>
            <Box sx={{ width: "75%" }}>
              <Skeleton variant="text" width="40%" />
            </Box>
            <Box sx={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Skeleton variant="text" width="60%" />
            </Box>
          </Stack>
        ))}
      </Box>
      <Box
        sx={{
          width: COLUMN_WIDTH.MOBILE_ACTIONS,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mr: 2,
        }}
      >
        <Skeleton variant="rectangular" width={28} height={28} />
      </Box>
    </Box>
  </Box>
);



const MobileCardItem = ({
  item,
  headers,
  primaryHeader,
  openRows,
  cardBoxShadow,
  rowHeaderColor,
  hasActions,
  actionTemplates,
  actions,
  onToggleRow,
  theme,
}: MobileCardItemProps<any>) => {
  const isExpanded = openRows[item.id];
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <Box
      sx={{
        p: 0,
        boxShadow: cardBoxShadow,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: theme.palette[rowHeaderColor].main,
          color: theme.palette[rowHeaderColor].contrastText,
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: hasSubItems ? "pointer" : "default",
        }}
        onClick={() => {
          if (hasSubItems) onToggleRow(item.id);
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
          {hasSubItems &&
            (isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
          <Typography fontWeight={600}>
            {primaryHeader.render
              ? primaryHeader.render(item[primaryHeader.key], item)
              : item[primaryHeader.key]}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ display: "flex", gap: 0, alignItems: "stretch" }}>
        <Box sx={{ px: 2, py: 1.5, width: COLUMN_WIDTH.MOBILE_CONTENT }}>
          {headers.map((header:any) => {
            const cellValue = renderCell(header, item);
            return (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                key={header.key}
                my={1}
                spacing={2}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: 700, flexShrink: 0 }}
                >
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
              width: COLUMN_WIDTH.MOBILE_ACTIONS,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              alignSelf: "center",
              mr: 2,
            }}
          >
            {renderActionButtons({ item, actionTemplates, actions })}
          </Box>
        )}
      </Box>

      {/* SubItems */}
      {isExpanded && hasSubItems && (
        <>
          <Divider sx={{ my: 1 }} />
          {item.subItems!.map((subItem, idx) => (
            <Fragment key={subItem.id}>
              <MobileSubItemContent
                subItem={subItem}
                headers={headers}
                hasActions={hasActions}
                actionTemplates={actionTemplates}
                actions={actions}
              />
              {idx < item.subItems!.length - 1 && <Divider sx={{ my: 1 }} />}
            </Fragment>
          ))}
        </>
      )}
    </Box>
  );
};

const MobileSubItemContent = ({
  subItem,
  headers,
  hasActions,
  actionTemplates,
  actions,
}: MobileSubItemContentProps<any>) => (
  <Box sx={{ display: "flex", gap: 0, alignItems: "flex-start", width: "100%" }}>
    <Box sx={{ px: 2, width: COLUMN_WIDTH.MOBILE_CONTENT }}>
      {headers.map((header:any) => {
        const cellValue = renderCell(header, subItem);
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            key={header.key}
            my={1}
            spacing={2}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 700, flexShrink: 0 }}
            >
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
          width: COLUMN_WIDTH.MOBILE_ACTIONS,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          alignSelf: "center",
          mr: 2,
        }}
      >
        {renderActionButtons({ item: subItem, actionTemplates, actions })}
      </Box>
    )}
  </Box>
);
