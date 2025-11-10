"use client";
import { AppearanceSettings } from "@/common/contexts/ProfileContext/interfaces/interface";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { useCustomize } from "@/common/contexts/setting/customizerContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSession } from "next-auth/react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseFab from "../base/BaseFab";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsSubMenu from "@/common/utils/state/isSubMenu";

const hideButton: string[] = [PageUrl.AUTH_SIGN_IN, PageUrl.AUTH_SIGN_UP, PageUrl.CALLBACK, PageUrl.FORGOT_PASSWORD, PageUrl.MAIN, PageUrl.PRICING];

const ActionButton = () => {
  const isMobie = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const isSubMenu = useIsSubMenu();
  const { data: session, status } = useSession();

  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const { loading } = useCustomize();
  const { isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { updateAppearance, appearance } = useProfile();
  const { isCollapse } = appearance;
  const updateSetting = (payload: Partial<AppearanceSettings>) => {
    updateAppearance(payload);
  };
  const isChecked = isCollapse === "mini_sidebar" ? true : false;

  useEffect(() => {
    if (!hideButton.includes(pathname)) {
      setShow(true);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  const handleExited = () => setShow(false);
  const sidebarAction = () => {
    return isMobie ? setIsMobileSidebar(!isMobileSidebar) : updateSetting({ isCollapse: isChecked ? "full_sidebar" : "mini_sidebar" });
  };

  if (!show || loading) return null;

  return (
    <BaseFab
      fadeDirection="left"
      sx={{ position: "fixed", top: 16, left: 20, zIndex: 2000 }}
      onClick={() => (isSubMenu ? router.back() : sidebarAction())}
      aria-label="action"
      open={visible}
      onExited={handleExited}
    >
      {isSubMenu ? <IconArrowLeft /> : <IconMenu2 />}
    </BaseFab>
  );
};

export default ActionButton;
