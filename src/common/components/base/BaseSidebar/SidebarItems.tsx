"use client";

import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { NavGroupType } from "./interface/sidebar";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";
import SidebarItemsSkeleton from "@/components/dashboard/user-auth/skeleton/SidebarItemsSkeleton";
import useIsMobile from "@/common/utils/state/isMobile";

interface SidebarItemsProps {
  menuItems?: NavGroupType[];
  enableNavigation?: boolean;
}

const SidebarItems = ({ menuItems = [], enableNavigation = false }: SidebarItemsProps) => {
  const currentPath = usePathname();
  const pathname = currentPath.split("/").slice(0, 4).join("/") || "/";
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const { isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { isCollapse } = useProfile().appearance;
  const { loading: isLoading } = useContext(CustomizerContext);

  const isMobile = useIsMobile();
  const hideMenu = !isMobile ? isCollapse == "mini_sidebar" : "";
  
  if (isLoading) return <SidebarItemsSkeleton />;

  const handleItemClick = () => {
    if (enableNavigation && isMobile) {
      setIsMobileSidebar(false);
    }
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={handleItemClick}
                enableNavigation={enableNavigation}
              />
            );
          } else {
            return (
              <NavItem 
                item={item} 
                key={item.id} 
                pathDirect={pathDirect} 
                hideMenu={hideMenu} 
                onClick={handleItemClick}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
