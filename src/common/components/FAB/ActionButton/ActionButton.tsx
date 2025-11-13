"use client";
import { AppearanceSettings } from "@/common/contexts/ProfileContext/interfaces/interface";
import { backButtonRoute } from "./backButton";
import { hideButtonRoute } from "./hideButton";
import { homeButtonRoute } from "./homeButton";
import { IconArrowLeft, IconMenu2, IconHome } from "@tabler/icons-react";
import { menuButtonRoute } from "./menuButton";
import { useCustomize } from "@/common/contexts/setting/customizerContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../../base/BaseFab";
import useIsMobile from "@/common/utils/state/isMobile";


type ActionType = "hide" | "back" | "menu" | "home";

export interface PageActionConfig {
  pathname: string;
  action: ActionType;
}

const pageActionConfig: PageActionConfig[] = [
  ...hideButtonRoute,
  ...backButtonRoute,
  ...menuButtonRoute,
  ...homeButtonRoute,
];

const getActionForPath = (pathname: string): ActionType => {
  const exactMatch = pageActionConfig.find((config) => config.pathname === pathname);
  if (exactMatch) return exactMatch.action;
  const wildcardMatch = pageActionConfig.find((config) => {
    if (!config.pathname.endsWith("/*")) return false;
    const prefix = config.pathname.slice(0, -2);
    return pathname.startsWith(prefix + "/") || pathname === prefix;
  });
  if (wildcardMatch) return wildcardMatch.action;
  return "back";
};

const ActionButton = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  const [action, setAction] = useState<ActionType>("back");
  const [visible, setVisible] = useState(true);
  const { loading } = useCustomize();
  const { isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { updateAppearance, appearance } = useProfile();
  const { isCollapse } = appearance;

  const updateSetting = (payload: Partial<AppearanceSettings>) => {
    updateAppearance(payload);
  };

  const isChecked = isCollapse === "mini_sidebar" ? true : false;

  useEffect(() => {
    const currentAction = getActionForPath(pathname);
    setAction(currentAction);
    setVisible(currentAction !== "hide");
  }, [pathname]);

  const handleExited = () => {
    setAction("back");
  };

  const handleClick = () => {
    switch (action) {
      case "back":
        router.back();
        break;
      case "menu":
        if (isMobile) {
          setIsMobileSidebar(!isMobileSidebar);
        } else {
          updateSetting({
            isCollapse: isChecked ? "full_sidebar" : "mini_sidebar",
          });
        }
        break;
      case "home":
        router.push("/dashboard");
        break;
      default:
        break;
    }
  };

  if (loading || !visible) return null;

  const renderIcon = () => {
    switch (action) {
      case "back":
        return <IconArrowLeft />;
      case "menu":
        return <IconMenu2 />;
      case "home":
        return <IconHome />;
      default:
        return <IconArrowLeft />;
    }
  };

  return (
    <BaseFab
      fadeDirection="left"
      sx={{ position: "fixed", top: 16, left: 20, zIndex: 2000 }}
      onClick={handleClick}
      aria-label="action"
      open={visible}
      onExited={handleExited}
    >
      {renderIcon()}
    </BaseFab>
  );
};

export default ActionButton;
