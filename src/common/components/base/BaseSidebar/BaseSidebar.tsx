import { NavGroupType } from "./interface/sidebar";
import Sidebar from "./Sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroupType[];
}

const BaseSidebar = ({ menuItems }: BaseSidebarProps) => {
  return <Sidebar menuItems={menuItems} />;
};

export default BaseSidebar;