"use client";
import React from "react";
import { IconApps, IconAppsFilled } from "@tabler/icons-react";
import { useAppShortcut } from "@/context/AppShortcutContext";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import BaseFab from "../base/BaseFab";

const AppShortcutButton = () => {
  const { toggle, isOpen } = useAppShortcut();
  const isMobile = useIsMobile();

  return (
    <BaseFab
      animation={false}
      color="primary"
      size="large"
      onClick={toggle}
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
      open={isMobile}
    >
      {isOpen ? <IconAppsFilled /> : <IconApps />}
    </BaseFab>
  );
};

export default AppShortcutButton;