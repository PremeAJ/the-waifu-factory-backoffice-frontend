"use client";
import React, { useContext, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  Box,
  Avatar,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  IconChevronRight,
  IconChevronDown,
  IconMoon,
} from "@tabler/icons-react";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import { CustomizerContext } from "@/app/context/setting/customizerContext";
import { UserContext } from "@/app/context/UserContext";
import Menuitems from "../layout/sidebar/MenuItems"; // นำเข้า Menuitems 

const MobileSettingsList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { email, firstname, lastname, avatarUrl } = user || {};
  
  // State เก็บ ID ของเมนูที่เปิดอยู่
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // ฟังก์ชันสลับการแสดง/ซ่อนเมนูย่อย
  const handleMenuToggle = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId) 
        : [...prev, menuId]
    );
  };

  // User profile header
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
        src={avatarUrl || "/images/profile/user-1.jpg"}
        alt="User"
        sx={{
          width: 80,
          height: 80,
          mb: 2,
        }}
      />
      <Typography variant="h5" fontWeight={600}>
        {firstname || "ผู้ใช้"} {lastname || ""}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {email || "example@email.com"}
      </Typography>
    </Box>
  );

  const { updateAppearance, activeMode, setActiveMode } = useContext(CustomizerContext);

  // อัปเดต theme ผ่าน CustomizerContext
  const toggleDarkMode = () => {
    const newMode = activeMode === "dark" ? "light" : "dark";
    setActiveMode(newMode);
    updateAppearance({ activeMode: newMode });
  };

  // Define NavItem and NavGroup types
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
            {isParent && (
              isExpanded 
                ? <IconChevronDown width={18} stroke={1.5} /> 
                : <IconChevronRight width={18} stroke={1.5} />
            )}
          </ListItemButton>
        </ListItem>

        {/* Submenu */}
        {isParent && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child: NavGroup, childIndex: number) => (
                renderNavItem(child, childIndex, depth + 1)
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // กรองเฉพาะเมนูที่ไม่ใช่ navlabel
  const filteredMenus = Menuitems.filter(item => !item.navlabel);

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
              {/* รายการเมนูปกติ */}
              {renderNavItem(item as NavItem, index)}
              
              {/* เส้นขั้นระหว่างรายการยกเว้นรายการสุดท้าย */}
              {index < filteredMenus.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
      
      {/* Dark Mode Toggle */}
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
