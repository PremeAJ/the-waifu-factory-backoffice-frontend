import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enableNavigation?: boolean; 
  autoCloseSidebar?: boolean; 
}

const BaseSidebar = ({ menuItems, open, onOpenChange, enableNavigation = false, autoCloseSidebar=true }: BaseSidebarProps) => {
  const pathname = usePathname();
  const {setIsMobileSidebar, isMobileSidebar} = useSidebarState();
  useEffect(() => {
    if (autoCloseSidebar) {
      setIsMobileSidebar(false);
    }
  }, [pathname]);
  return (
    <Sidebar 
      menuItems={menuItems} 
      open={open} 
      onOpenChange={onOpenChange} 
      enableNavigation={enableNavigation} 
    />
  );
};

export default BaseSidebar;