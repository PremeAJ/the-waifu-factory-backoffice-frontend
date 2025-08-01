"use client";
import React from "react";
import { IconApps, IconAppsFilled } from "@tabler/icons-react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import BaseFab from "../base/BaseFab";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";

const AppShortcutButton = () => {
  const { toggleAppShortcut, appShortcutisOpen } = useSidebarState();
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
        zIndex: 9999,
      }}
      open={isMobile}
    >
      {appShortcutisOpen ? <IconAppsFilled /> : <IconApps />}
    </BaseFab>
  );
};

export default AppShortcutButton;