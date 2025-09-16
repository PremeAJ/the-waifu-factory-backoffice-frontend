"use client";
import { IconGridDots } from "@tabler/icons-react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../base/BaseFab";
import React from "react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";

const AppShortcutButton = () => {
  const { toggleAppShortcut } = useSidebarState();
  const isMobile = useIsMobile();
  const isSubmenu = useIsSubMenu();

  return (
    <BaseFab
      animation={false}
      color="primary"
      size="large"
      onClick={toggleAppShortcut}
      sx={{
        position: "fixed",
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        transition: "bottom 180ms ease", // Optional: for smooth transition
      }}
      open={isMobile && !isSubmenu}
    >
      <IconGridDots />
    </BaseFab>
  );
};

export default AppShortcutButton;
