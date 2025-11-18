import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import { DrawerProps } from "@mui/material/Drawer";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enableNavigation?: boolean; 
  autoCloseSidebar?: boolean; 
  anchor?: DrawerProps["anchor"]
}

const BaseSidebar = ({ menuItems, open, onOpenChange, enableNavigation = false, autoCloseSidebar=true,anchor='left' }: BaseSidebarProps) => {
  const pathname = usePathname();
  const {setIsMobileSidebar, isMobileSidebar} = useSidebarState();
  useEffect(() => {
    if (autoCloseSidebar) {
      setIsMobileSidebar(false);
    }
  }, [pathname]);
  return (
    <Sidebar 
      anchor={anchor}
      menuItems={menuItems} 
      open={open} 
      onOpenChange={onOpenChange} 
      enableNavigation={enableNavigation} 
    />
  );
};

export default BaseSidebar;