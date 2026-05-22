"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageUrl } from "@/common/constants/pageUrl";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Logo from "@/common/components/shared/Logo";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { IconBrandDiscord } from "@tabler/icons-react";

const ALL_MENU_ITEMS = [
  { label: "Home",       href: "/",           authOnly: false },
  { label: "Adoptables", href: "/adoptables", authOnly: false },
  { label: "Auctions",   href: "/auctions",   authOnly: false },
  { label: "Commission", href: "/commission", authOnly: false },
  { label: "Member",     href: "/member",     authOnly: true  },
];

const MobileSidebar = () => {
  const theme   = useTheme();
  const pathname = usePathname();
  const router  = useRouter();
  const { user: waifuUser } = useCurrentUser();
  const menuItems = ALL_MENU_ITEMS.filter((item) => !item.authOnly || !!waifuUser);

  return (
    <>
      <Box px={3} py={2}>
        <Logo size="small" />
      </Box>

      <Divider />

      <List disablePadding sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              selected={isActive}
              onClick={() => router.push(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                fontWeight: 600,
                color: isActive ? "primary.main" : "text.secondary",
                "&.Mui-selected": {
                  bgcolor: `${theme.palette.primary.main}14`,
                  color: "primary.main",
                  "&:hover": { bgcolor: `${theme.palette.primary.main}1f` },
                },
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: isActive ? 700 : 500, fontSize: 15 } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mt: 1 }} />

      <Box p={2}>
        <Stack spacing={1.5}>
          {!waifuUser && (
            <BaseButton
              variant="contained"
              label="Login"
              href={PageUrl.AUTH_SIGN_IN}
              startIcon={<IconBrandDiscord size={18} />}
              sx={{ bgcolor: "#5865F2", color: "#fff" }}
            />
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MobileSidebar;
