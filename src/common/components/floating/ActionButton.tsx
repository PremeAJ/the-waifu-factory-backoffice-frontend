"use client";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useCustomize } from "@/common/contexts/setting/customizerContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BaseFab from "../base/BaseFab";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";

const hideButton = ["/", "/auth/callback", "/dashboard/auth/callback", "/dashboard/auth/login", "/auth/login"];

const ActionButton = () => {
  const isMobie = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const isSubMenu = useIsSubMenu()

  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const { isMobileSidebar, setIsMobileSidebar, isCollapse, setIsCollapse } = useCustomize();

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
    return isMobie
      ? setIsMobileSidebar(!isMobileSidebar)
      : isCollapse === "full-sidebar"
      ? setIsCollapse("mini-sidebar")
      : setIsCollapse("full-sidebar");
  };

  if (!show) return null;

  return (
    <BaseFab
      fadeDirection="left"
      sx={{ position: "fixed", top: 16, left: 16, }}
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
