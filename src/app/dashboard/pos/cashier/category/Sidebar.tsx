"use client";
import { useMemo } from "react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseSidebar from "@/common/components/base/BaseSidebar/BaseSidebar";
import { buildMenuItems } from "./MenuItems";

const Sidebar = () => {
  const { categories, loading } = useCategories();
  const { isCashierCategoriesSidebar, setIsCashierCategoriesSidebar } = useSidebarState();
  
  const menuItems = useMemo(() => buildMenuItems(categories || []), [categories]);

  return (
    <BaseSidebar 
      menuItems={menuItems}
      open={isCashierCategoriesSidebar}
      onOpenChange={setIsCashierCategoriesSidebar}
      enableNavigation
    />
  );
};

export default Sidebar;
