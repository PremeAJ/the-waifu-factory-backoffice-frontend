"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { styled, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { IconBrandDiscord } from "@tabler/icons-react";

import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { PageUrl } from "@/common/constants/pageUrl";

// 1. ปลอกหุ้มสไตล์เพื่อควบคุมสีตัวหนังสือตามสถานะ Active ของหน้าเว็บ
const NavItemContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  position: "relative",
  display: "inline-block",

  "& .nav-button": {
    fontSize: "16px",
    textTransform: "none",
    padding: "8px 16px",
    position: "relative",
    zIndex: 2,
    // ใช้สี Primary เมือ Active และใช้ Secondary เมื่อไม่อยู่ในหน้านั้น
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    transition: "color 0.25s ease-in-out",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main, // เปลี่ยนเป็นสี Primary ตอน hover ตัวอักษร
    },
  },
}));

// 2. ฟังก์ชันช่วยจัดสไตล์สำหรับดึงค่า Theme ของ MUI ส่งต่อให้ Framer Motion
const getHoverBgStyle = (theme: any) => ({
  position: "absolute" as const,
  inset: "4px 4px",
  borderRadius: "8px",
  // ใช้สี hover จากระบบธีมหลัก (ดรอปความเข้มลงอัตโนมัติตามธีมของคุณ)
  backgroundColor: theme.palette.action.hover,
  zIndex: 1,
  pointerEvents: "none" as const,
});

const getActiveIndicatorStyle = (theme: any) => ({
  position: "absolute" as const,
  bottom: 0,
  left: "12px",
  right: "12px",
  height: "3px",
  // ใช้สีหลัก (Primary) ของแอปพลิเคชันคุณทำเส้นใต้เมนู
  backgroundColor: theme.palette.primary.main,
  borderRadius: "2px",
  zIndex: 3,
});

const Navigations = () => {
  const { t } = useTranslation();
  const { user: waifuUser } = useCurrentUser();
  const pathname = usePathname();
  const theme = useTheme(); // เรียกใช้งาน Material UI Theme Object

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Adoptables", href: "/adoptables" },
    { label: "Auctions", href: "/auctions" },
    { label: "Commission", href: "/commission" },
  ];

  return (
    <>
      {menuItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <NavItemContainer key={item.href} active={isActive}>
            {/* คุมพฤติกรรมการเล่นอนิเมชันเชื่อมโยงกันระหว่างลูกๆ */}
            <motion.div
              style={{ display: "inline-block", position: "relative" }}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* ปุ่มกดดั้งเดิมยิงตรงเข้า Next Link */}
              <Button
                component={Link}
                href={item.href}
                variant="text"
                className="nav-button"
                disableRipple
              >
                {item.label}
              </Button>

              {/* อนิเมชันพื้นหลังตอนเอาเมาส์มาวาง (Hover Background) */}
              <motion.div
                style={getHoverBgStyle(theme)} // ส่งต่อวัตถุ Theme เข้าไป
                variants={{
                  rest: { opacity: 0, scale: 0.95 },
                  hover: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.2 }}
              />

              {/* อนิเมชันเส้นใต้เลื่อนสไลด์ (Active Indicator) */}
              {isActive && (
                <motion.div
                  layoutId="navigationActiveIndicator"
                  style={getActiveIndicatorStyle(theme)} // ใช้สี Primary จาก MUI Theme โดยตรง
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </motion.div>
          </NavItemContainer>
        );
      })}

      {!waifuUser && (
        <BaseButton
          label="Login"
          href={PageUrl.AUTH_SIGN_IN}
          fullWidth={false}
          size="small"
          startIcon={<IconBrandDiscord size={18} />}
          sx={{
            bgcolor: "#5865F2",
            color: "#fff",
            ml: 2,
          }}
        />
      )}
    </>
  );
};

export default Navigations;