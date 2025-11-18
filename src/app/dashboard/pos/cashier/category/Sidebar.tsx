"use client";
import { buildMenuItems } from "./MenuItems";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { useMemo } from "react";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseSidebar from "@/common/components/base/BaseSidebar/BaseSidebar";
import useIsMobile from "@/common/utils/state/isMobile";

const Sidebar = () => {
  const { categories, loading } = useCategories();
  const { isCashierCategoriesSidebar, setIsCashierCategoriesSidebar } = useSidebarState();
  const isMobile = useIsMobile();
  const menuItems = useMemo(() => buildMenuItems(categories || []), [categories]);

  return (
    <BaseSidebar 
      menuItems={menuItems}
      open={isCashierCategoriesSidebar}
      onOpenChange={setIsCashierCategoriesSidebar}
      enableNavigation
      autoCloseSidebar={false}
      anchor={isMobile ? "bottom" : "left"}
    />
  );
};

export default Sidebar;
