import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const BaseSidebar = ({ menuItems, open, onOpenChange }: BaseSidebarProps) => {
  return <Sidebar menuItems={menuItems} open={open} onOpenChange={onOpenChange} />;
};

export default BaseSidebar;