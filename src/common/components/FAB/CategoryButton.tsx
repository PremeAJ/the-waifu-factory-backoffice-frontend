"use client";
import React, { useContext } from "react";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import useIsMobile from "@/common/utils/state/isMobile";
import BaseFab from "../base/BaseFab";
import { IconCategory } from "@tabler/icons-react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";

type SidebarOpenButtonProps = {
  onClick: () => void;
  sx?: object;
};

const CategoryButton: React.FC<SidebarOpenButtonProps> = ({ onClick, sx }) => {
  const isMobile = useIsMobile();
  const { isMobileSidebar } = useSidebarState();
  if (!isMobile) return null;

  return (
    <BaseFab
      fadeDirection="right"
      size="medium"
      onClick={onClick}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        ...sx,
      }}
      animation
    >
      <IconCategory />
    </BaseFab>
  );
};

export default CategoryButton;
