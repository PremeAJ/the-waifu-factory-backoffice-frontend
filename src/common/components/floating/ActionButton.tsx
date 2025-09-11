"use client";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useCustomize } from "@/common/contexts/setting/customizerContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BaseFab from "../base/BaseFab";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";
import { useSession } from "next-auth/react";

const hideButton = ["/", "/auth/callback", "/auth/sign-in", "/auth/sign-up"];

const ActionButton = () => {
  const isMobie = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const isSubMenu = useIsSubMenu();
  const { data: session, status } = useSession();

  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const { isMobileSidebar, setIsMobileSidebar, isCollapse, setIsCollapse, loading } = useCustomize();

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
      : isCollapse === "full_sidebar"
      ? setIsCollapse("mini_sidebar")
      : setIsCollapse("full_sidebar");
  };

  if (!show || loading) return null;
  
  return (
    <BaseFab
      fadeDirection="left"
      sx={{ position: "fixed", top: 16, left: 16 }}
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
