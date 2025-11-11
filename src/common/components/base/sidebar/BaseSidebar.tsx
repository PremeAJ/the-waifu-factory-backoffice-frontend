import Sidebar from "@/common/components/base/sidebar/sidebar";
import { NavGroup } from "./interface/sidebar";

interface BaseSidebarProps {
  menuItems?: NavGroup[];
}

const BaseSidebar = ({ menuItems }: BaseSidebarProps) => {
  return <Sidebar menuItems={menuItems} />;
};

export default BaseSidebar;