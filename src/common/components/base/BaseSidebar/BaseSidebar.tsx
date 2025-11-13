import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enableNavigation?: boolean; // ✅ เพิ่ม
}

const BaseSidebar = ({ menuItems, open, onOpenChange, enableNavigation = false }: BaseSidebarProps) => {
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