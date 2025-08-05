"use client";
import React, { useContext } from "react";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import BaseFab from "../base/BaseFab";
import { IconCategory } from "@tabler/icons-react";

type SidebarOpenButtonProps = {
  onClick: () => void;
  sx?: object;
};

const CategoryButton: React.FC<SidebarOpenButtonProps> = ({ onClick, sx }) => {
  const isMobile = useIsMobile();
  const { isMobileSidebar } = useContext(CustomizerContext);
  if (isMobileSidebar || !isMobile) return null;

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
