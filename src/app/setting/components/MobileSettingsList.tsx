"use client";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import React, { Fragment, useState } from "react";
import BaseAvatar from "@/common/components/base/BaseAvatar"; 
import { settingSidebarItem } from "@/common/components/base/BaseSidebar/item/settingSidebarItem";

const MobileSettingsList = () => {
  const theme = useTheme();
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
      <BaseAvatar
        src={avatar || ""}
        alt={fullName}
        size={80}
        lightbox
        sx={{
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
    const isLink = !isParent && !!item.href;

    return (
      <Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            component={isLink ? (Link as any) : "button"}
            {...(isLink ? { href: item.href as any } : {})}
            onClick={isParent ? () => handleMenuToggle(item.id) : undefined}
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
      </Fragment>
    );
  };

  const filteredMenus = settingSidebarItem.filter((item) => !item.navlabel);

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
            <Fragment key={item.id || index}>
              {renderNavItem(item as NavItem, index)}

              {index < filteredMenus.length - 1 && <Divider variant="inset" component="li" />}
            </Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MobileSettingsList;
