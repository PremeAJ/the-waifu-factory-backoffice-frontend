"use client";
import { BaseFab } from "../../base";
import { hideButtonRoute } from "./hideButton";
import { IconApps } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import React from "react";
import useIsMobile from "@/common/utils/state/isMobile";

const AppShortcutButton = () => {
  const { toggleAppShortcut } = useSidebarState();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isHiddenByRoute = React.useMemo(() => {
    if (!pathname) return false;
    return hideButtonRoute.some((cfg) => {
      const p = cfg.pathname;
      if (p.endsWith("/*")) {
        const prefix = p.slice(0, -2);
        return pathname === prefix || pathname.startsWith(prefix + "/");
      }
      return pathname === p;
    });
  }, [pathname]);

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
      open={isMobile && !isHiddenByRoute}
    >
      <IconApps />
    </BaseFab>
  );
};

export default AppShortcutButton;
