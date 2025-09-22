"use client";
import { IconGridDots } from "@tabler/icons-react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../base/BaseFab";
import React from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsSubMenu from "@/common/utils/state/isSubMenu";

const AppShortcutButton = () => {
  const { toggleAppShortcut } = useSidebarState();
  const isMobile = useIsMobile();
  const isSubmenu = useIsSubMenu()

  return (
    <BaseFab
      animation={false}
      color="primary"
      size="large"
      onClick={toggleAppShortcut}
      sx={{
        position: "fixed",
        bottom: '90vh',
        left: "50%",
        transform: "translateX(-50%)",
      }}
      open={isMobile && !isSubmenu}
    >
      <IconGridDots />
    </BaseFab>
  );
};

export default AppShortcutButton;
