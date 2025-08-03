"use client";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import BaseFab from "../base/BaseFab";
import { useCustomize } from "@/common/contexts/setting/customizerContext";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

const hideButton = ["/", "/auth/callback", "/dashboard/auth/callback", "/dashboard/auth/login", "/auth/login"];
const manualBackPrefixes = ["/auth", "/dashboard/auth", "/dashboard/setting"];

const ActionButton = () => {
  const isMobie = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const allowBack = pathname.split("/").length > 3 || manualBackPrefixes.some((prefix) => pathname.startsWith(prefix));

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
      sx={{ position: "fixed", top: 16, left: 16, zIndex: 100 }}
      onClick={() => (allowBack ? router.back() : sidebarAction())}
      aria-label="action"
      open={visible}
      onExited={handleExited}
    >
      {allowBack ? <IconArrowLeft /> : <IconMenu2 />}
    </BaseFab>
  );
};

export default ActionButton;
