import { DataItem } from "./interface";
import { useInView } from "react-intersection-observer";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useState, useEffect, ChangeEvent } from "react";
import { useTheme } from "@mui/material";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";

export const useTableState = () => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id: string) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];
    setSelectedItems(newSelected);
    return newSelected;
  };

  const handleSelectAll = (
    event: ChangeEvent<HTMLInputElement>,
    data: DataItem[]
  ) => {
    const newSelected = event.target.checked ? data.map((item) => item.id) : [];
    setSelectedItems(newSelected);
    return newSelected;
  };

  return {
    openRows,
    toggleRow,
    selectedItems,
    setSelectedItems,
    handleSelect,
    handleSelectAll,
  };
};

export const useTableTheme = () => {
  const theme = useTheme();
  const { isCardShadow, activeMode } = useProfile().appearance;

  const cardBoxShadow = isCardShadow
    ? activeMode === "dark"
      ? "0 6px 18px -6px rgba(255, 255, 255, 0.14)"
      : theme.shadows?.[1] ?? "0 1px 3px rgba(0,0,0,0.08)"
    : "none";

  return { theme, cardBoxShadow };
};

export const useTableResponsive = () => {
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobile && isPortrait;

  return { isMobile, isPortrait, isMobilePortrait };
};

export const useInfiniteScroll = (onLoadMore?: () => void) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && onLoadMore) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);

  return { ref, inView };
};
