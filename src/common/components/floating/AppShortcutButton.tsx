"use client";
import { IconGridDots } from "@tabler/icons-react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../base/BaseFab";
import React from "react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

const AppShortcutButton = () => {
  const { toggleAppShortcut } = useSidebarState();
  const isMobile = useIsMobile();

  return (
    <BaseFab
      animation={false}
      color="primary"
      size="large"
      onClick={toggleAppShortcut}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      open={isMobile}
    >
      <IconGridDots />
    </BaseFab>
  );
};

export default AppShortcutButton;
