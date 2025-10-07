"use client";
import { IconApps, IconGridDots } from "@tabler/icons-react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../base/BaseFab";
import React from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsSubMenu from "@/common/utils/state/isSubMenu";

const AppShortcutButton = () => {
  const { toggleAppShortcut } = useSidebarState();
  const isMobile = useIsMobile();
  const isSubmenu = useIsSubMenu();

  return (
    <BaseFab
      fadeDirection="up"
      color="primary"
      size="large"
      onClick={toggleAppShortcut}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "45%",
      }}
      open={isMobile && !isSubmenu}
    >
      <IconApps />
    </BaseFab>
  );
};

export default AppShortcutButton;
