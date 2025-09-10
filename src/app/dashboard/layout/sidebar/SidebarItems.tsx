import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Menuitems from "@/common/constants/sidebarMenuList/MenuItems";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup/NavGroup";
import NavItem from "./NavItem";
import SidebarItemsSkeleton from "@/components/dashboard/user-auth/skeleton/SidebarItemsSkeleton";
import useMediaQuery from "@mui/material/useMediaQuery";

const SidebarItems = () => {
  const currentPath = usePathname();
  const pathname = currentPath.split("/").slice(0, 4).join("/") || "/";
  console.log("🚀 ~ SidebarItems ~ pathname:", pathname)
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const { isSidebarHover, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const { loading: isLoading } = useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? isCollapse == "mini_sidebar" && !isSidebarHover : "";
  if (isLoading) return <SidebarItemsSkeleton />;
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
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
                onClick={() => setIsMobileSidebar(!isMobileSidebar)}
              />
            );
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => setIsMobileSidebar(!isMobileSidebar)}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
