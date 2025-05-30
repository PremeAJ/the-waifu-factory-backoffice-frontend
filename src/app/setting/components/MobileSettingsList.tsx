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
  IconUser,
  IconPalette,
  IconLock,
  IconBell,
  IconWallet,
  IconHelp,
  IconMessage,
  IconMoon,
  IconHome,
  IconMapPin,
  IconKey,
  IconDeviceMobile,
} from "@tabler/icons-react";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import { CustomizerContext } from "@/app/context/setting/customizerContext";
import { UserContext } from "@/app/context/UserContext";

// กำหนดโครงสร้าง type สำหรับ menu item
interface MenuItemType {
  id: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItemType[];
}

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

  // รายการเมนูพร้อม submenu
  const settingsItems: MenuItemType[] = [
    {
      id: "account",
      title: "บัญชีของฉัน",
      icon: <IconUser width={22} />,
      children: [
        {
          id: "profile",
          title: "ข้อมูลส่วนตัว",
          icon: <IconHome width={22} />,
          href: "/setting/account/profile",
        },
        {
          id: "address",
          title: "ที่อยู่",
          icon: <IconMapPin width={22} />,
          href: "/setting/account/address",
        },
        {
          id: "password",
          title: "รหัสผ่าน",
          icon: <IconKey width={22} />,
          href: "/setting/account/security",
        },
        {
          id: "phone",
          title: "หมายเลขโทรศัพท์",
          icon: <IconDeviceMobile width={22} />,
          href: "/setting/account/phone",
        },
      ],
    },
    {
      id: "appearance",
      title: "การแสดงผล",
      icon: <IconPalette width={22} />,
      href: "/setting/app/appearance",
    },
    {
      id: "security",
      title: "ความปลอดภัย",
      icon: <IconLock width={22} />,
      href: "/setting/account/security",
    },
    {
      id: "notifications",
      title: "การแจ้งเตือน",
      icon: <IconBell width={22} />,
      href: "/setting/notifications",
    },
    {
      id: "payments",
      title: "การชำระเงิน",
      icon: <IconWallet width={22} />,
      href: "/setting/payments",
    },
    {
      id: "help",
      title: "ช่วยเหลือ",
      icon: <IconHelp width={22} />,
      href: "/setting/help",
    },
    {
      id: "support",
      title: "ติดต่อเรา",
      icon: <IconMessage width={22} />,
      href: "/setting/support",
    },
  ];

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
        {firstname} {lastname}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {email}
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

  // วิธีการแสดงผล MenuItem แบบ recursive
  const renderMenuItem = (item: MenuItemType, index: number, depth: number = 0) => {
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
              pl: depth > 0 ? 4 : 2, // เพิ่ม padding ซ้ายตาม depth
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.primary.main,
                minWidth: 40,
              }}
            >
              {item.icon}
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

        {/* Submenu ที่จะแสดงเมื่อกดเปิด */}
        {isParent && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child, childIndex) => (
                renderMenuItem(child, childIndex, depth + 1)
              ))}
            </List>
          </Collapse>
        )}

        {/* เส้นขั้นระหว่าง item ยกเว้น item สุดท้าย */}
        {index < settingsItems.length - 1 && depth === 0 && (
          <Divider variant="inset" component="li" />
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          maxWidth: "100%",
          bgcolor: "background.paper",
          borderRadius: (theme) => theme.shape.borderRadius,
        }} 
      >
        {userProfile}
        <Divider />
        <List disablePadding>
          {settingsItems.map((item, index) => renderMenuItem(item, index))}
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
