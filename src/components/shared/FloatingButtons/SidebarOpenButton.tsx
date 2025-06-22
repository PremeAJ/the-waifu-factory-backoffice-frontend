"use client";
import React, { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { CustomizerContext } from "@/context/setting/customizerContext";
import BaseFab from "@/components/base/BaseFab";
import { useMediaQuery, useTheme } from "@mui/material";
import useIsMobile from "@/utils/breakpoints/isMobile";

type SidebarOpenButtonProps = {
  onClick: () => void;
  sx?: object;
};

const SidebarOpenButton: React.FC<SidebarOpenButtonProps> = ({ onClick, sx }) => {
  const isMobile = useIsMobile();
  const { isMobileSidebar } = useContext(CustomizerContext);
  if (isMobileSidebar || !isMobile) return null;

  return (
    <BaseFab
      fadeDirection="right"
      aria-label="open sidebar"
      size="medium"
      onClick={onClick}
      sx={{
        position: "fixed",
        zIndex: 9999,
        top: 16,
        left: 16,
        ...sx,
      }}
      animation
    >
      <MenuIcon
        sx={{
          transition: "transform 0.2s",
          "&:active": { transform: "rotate(90deg) scale(1.2)" },
        }}
      />
    </BaseFab>
  );
};

export default SidebarOpenButton;
