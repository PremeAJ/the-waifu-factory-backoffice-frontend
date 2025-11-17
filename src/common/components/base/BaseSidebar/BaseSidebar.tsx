import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enableNavigation?: boolean; // ✅ เพิ่ม
  autoCloseSidebar?: boolean; // ✅ เพิ่ม
}

const BaseSidebar = ({ menuItems, open, onOpenChange, enableNavigation = false, autoCloseSidebar=true }: BaseSidebarProps) => {
  useEffect(() => {
    if (open && onOpenChange && autoCloseSidebar) {
      onOpenChange(false);
    }
  }, [pathname, autoCloseSidebar, open, onOpenChange]);
  return (
    <Sidebar 
      menuItems={menuItems} 
      open={open} 
      onOpenChange={onOpenChange} 
      enableNavigation={enableNavigation} // ✅ ส่งต่อ
    />
  );
};

export default BaseSidebar;