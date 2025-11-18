"use client";

import { BaseTableProps, TableHeader } from "./interface";
import { renderDesktopTable } from "./renderDesktop";
import { renderMobileTable } from "./renderMobile";
import { useInfiniteScroll, useTableResponsive, useTableState, useTableTheme, } from "./hooks";

const BaseTable = <T extends readonly TableHeader[]>({
  actions,
  actionTemplates,
  data,
  enableSelection = false,
  headers,
  isLoadingMore,
  isReachingEnd,
  loading = false,
  onLoadMore,
  onSelectionChange,
  pagination,
  rowHeaderColor,
}: BaseTableProps<T>) => {
  const {
    handleSelect,
    handleSelectAll,
    openRows,
    selectedItems,
    setSelectedItems,
    toggleRow,
  } = useTableState();

  const { theme, cardBoxShadow } = useTableTheme();
  const { isMobilePortrait } = useTableResponsive();
  const { ref: scrollRef } = useInfiniteScroll(onLoadMore);
  const handleSelectionChange = (newSelected: string[]) => {
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  const hasActions =
    (actionTemplates && actionTemplates.length > 0) || !!actions;

  if (isMobilePortrait) {
    return renderMobileTable({
      headers,
      data,
      loading,
      openRows,
      hasActions,
      cardBoxShadow,
      rowHeaderColor,
      actionTemplates,
      actions,
      pagination,
      isLoadingMore,
      isReachingEnd,
      scrollRef,
      onToggleRow: toggleRow,
      theme,
    });
  }

  return renderDesktopTable({
    actions,
    actionTemplates,
    data,
    enableSelection,
    hasActions,
    headers,
    loading,
    onToggleRow: toggleRow,
    openRows,
    pagination,
    selectedItems,
    onSelectItem: (id) => {
      const newSelected = handleSelect(id);
      handleSelectionChange(newSelected);
    },
    onSelectAll: (checked) => {
      const newSelected = handleSelectAll(
        { target: { checked } } as any,
        data
      );
      handleSelectionChange(newSelected);
    },
    theme,
  });
};

export default BaseTable;
