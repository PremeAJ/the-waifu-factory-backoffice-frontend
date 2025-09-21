"use client";
import { Avatar, Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { IconChevronRight, IconChevronDown, IconMoon } from "@tabler/icons-react";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import CustomSwitch from "@/components/forms/theme-elements/CustomSwitch";
import Menuitems from "../layout/sidebar/MenuItems";
import React, { useContext, useState } from "react";

const MobileSettingsList = () => {
  const { updateAppearance } = useProfile();
  const theme = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const { fullName, email, avatar } = session?.profile || {};
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleMenuToggle = (menuId: string) => {
    setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  const userProfile = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        mb: 1,
      }}
    >
      <Avatar
        src={avatar || "/images/profile/user-1.jpg"}
        alt="User"
        sx={{
          width: 80,
          height: 80,
          mb: 2,
        }}
      />
      <Typography variant="h5" fontWeight={600}>
        {fullName || "ผู้ใช้"}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {email || "example@email.com"}
      </Typography>
    </Box>
  );

  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const toggleDarkMode = () => {
    const newMode = activeMode === "dark" ? "light" : "dark";
    updateAppearance({ activeMode: newMode });
  };

  type NavItem = {
    id: string;
    title: string;
    icon: React.ElementType | React.ReactElement;
    href?: string;
    navlabel?: boolean;
    children?: NavItem[];
  };
  type NavGroup = NavItem;

  const renderIcon = (icon: any) => {
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon;
    return <IconComponent width={22} />;
  };

  const renderNavItem = (item: NavItem, index: number, depth: number = 0) => {
    const isParent = item.children && item.children.length > 0;
    const isExpanded = openMenus.includes(item.id);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (isParent) {
                handleMenuToggle(item.id);
              } else if (item.href) {
                router.push(item.href);
              }
            }}
            sx={{
              py: 1.5,
              minHeight: 50,
              color: "text.primary",
              pl: depth > 0 ? 4 : 2,
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.primary.main,
                minWidth: 40,
              }}
            >
              {renderIcon(item.icon)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight="500">
                  {item.title}
                </Typography>
              }
            />
            {isParent && (isExpanded ? <IconChevronDown width={18} stroke={1.5} /> : <IconChevronRight width={18} stroke={1.5} />)}
          </ListItemButton>
        </ListItem>

        {isParent && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child: NavGroup, childIndex: number) => renderNavItem(child, childIndex, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const filteredMenus = Menuitems.filter((item) => !item.navlabel);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          maxWidth: "100%",
          bgcolor: "background.paper",
        }}
      >
        {userProfile}
        <Divider />
        <List disablePadding>
          {filteredMenus.map((item, index) => (
            <React.Fragment key={item.id || index}>
              {renderNavItem(item as NavItem, index)}

              {index < filteredMenus.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Typography variant="subtitle2" color="textSecondary" sx={{ px: 3, py: 2, mt: 2 }}>
        การตั้งค่าทั่วไป
      </Typography>
      <ListItem
        sx={{
          py: 1.5,
          minHeight: 50,
          color: "text.primary",
          bgcolor: "background.paper",
          borderRadius: (theme) => theme.shape.borderRadius,
        }}
      >
        <ListItemIcon>
          <IconMoon width={22} style={{ color: activeMode === "dark" ? theme.palette.primary.main : "inherit" }} />
        </ListItemIcon>
        <ListItemText primary="Dark Mode" />
        <CustomSwitch checked={activeMode === "dark"} onChange={toggleDarkMode} />
      </ListItem>
    </Box>
  );
};

export default MobileSettingsList;
