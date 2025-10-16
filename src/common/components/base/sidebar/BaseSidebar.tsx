import Sidebar from "./Sidebar";
import type { NavGroup as NavGroupType } from "@/common/utils/types/layout/sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
}

const BaseSidebar = ({ menuItems }: BaseSidebarProps) => {
  return <Sidebar menuItems={menuItems} />;
};

export default BaseSidebar;