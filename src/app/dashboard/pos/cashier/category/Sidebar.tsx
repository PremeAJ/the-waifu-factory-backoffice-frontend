"use client";
import { useMemo } from "react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseSidebar from "@/common/components/base/BaseSidebar/BaseSidebar";
import { buildMenuItems } from "./MenuItems";

const Sidebar = () => {
  const { categories, loading } = useCategories();
  console.log("🚀 ~ Sidebar ~ categories:", categories)
  
  const menuItems = useMemo(() => buildMenuItems(categories || []), [categories]);

  return <BaseSidebar menuItems={menuItems} />;
};

export default Sidebar;
