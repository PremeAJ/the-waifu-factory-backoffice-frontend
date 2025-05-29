"use client";
import React, { useContext } from "react";
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  IconChevronRight,
  IconUser,
  IconPalette,
  IconLock,
  IconBell,
  IconWallet,
  IconHelp,
  IconMessage,
  IconMoon,
} from "@tabler/icons-react";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import { CustomizerContext } from "@/app/context/setting/customizerContext";
import { UserContext } from "@/app/context/UserContext";

const MobileSettingsList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { email, firstname, lastname, avatarUrl } = user || {};
  // กรองเฉพาะเมนู settings จาก MenuItems หรือกำหนดเองตามต้องการ
  const settingsItems = [
    {
      id: "account",
      title: "บัญชีของฉัน",
      icon: <IconUser width={22} />,
      href: "/setting/account/profile",
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
          {settingsItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(item.href)}
                  sx={{
                    py: 1.5,
                    minHeight: 50,
                    color: "text.primary",
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
                  <IconChevronRight width={18} stroke={1.5} />
                </ListItemButton>
              </ListItem>
              {index < settingsItems.length - 1 && <Divider variant="inset" component="li" />}
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
