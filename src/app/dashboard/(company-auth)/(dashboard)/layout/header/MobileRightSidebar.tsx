import React, { useState } from "react";
import { IconApps, IconSearch, IconX } from "@tabler/icons-react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { useAppShortcut } from "@/common/contexts/AppShortcutContext";
import AppLinks from "./AppLinks";
import Link from "next/link";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

const MobileRightSidebar = () => {
  const { isOpen, open, close } = useAppShortcut();
  const [searchApp, setSearchApp] = useState("");
  const isMobile = useIsMobile();

  const cartContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box px={3} pt={2} pb={2}>
        <TextField
          fullWidth
          placeholder="Search apps..."
          value={searchApp}
          onChange={(e) => setSearchApp(e.target.value)}
          size="small"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} stroke={1.5} />
                </InputAdornment>
              ),
              endAdornment: searchApp && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchApp("")}>
                    <IconX size={14} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Box px={3} pb={3}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight={500} mb={2}>
            Applications
          </Typography>
          <AppLinks searchApp={searchApp} />
        </Box>

        <Divider />
        {/* <Box px={3} pt={2}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight={500} mb={2}>
            Frequently Used
          </Typography>
          <List disablePadding>
            <ListItemButton component={Link} href="/apps/chats" sx={{ borderRadius: 1, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 35 }}>
                <IconMessages size="21" stroke="1.5" />
              </ListItemIcon>
              <ListItemText primary="Chats" />
            </ListItemButton>

            <ListItemButton component={Link} href="/apps/calendar" sx={{ borderRadius: 1, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 35 }}>
                <IconCalendarEvent size="21" stroke="1.5" />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>

            <ListItemButton component={Link} href="/apps/email" sx={{ borderRadius: 1, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 35 }}>
                <IconMail size="21" stroke="1.5" />
              </ListItemIcon>
              <ListItemText primary="Email" />
            </ListItemButton>
          </List>
        </Box> */}
      </Box>
    </Box>
  );

  return (
    <Box>
      {!isMobile && (
        <IconButton size="large" color="inherit" onClick={open} sx={{ ...(isOpen && { color: "primary.main" }) }}>
          <IconApps size="21" stroke="1.5" />
        </IconButton>
      )}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={isOpen}
        onClose={close}
        slotProps={{
          paper: {
            sx: {
              width: isMobile ? "100%" : { xs: "100%", sm: "350px" },
              height: isMobile ? "60%" : "100%",
              maxWidth: "100%",
            },
          },
        }}
      >
        <Box p={2} pb={0} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={600}>
            Apps
          </Typography>
          <IconButton onClick={close}>
            <IconX size={18} />
          </IconButton>
        </Box>
        {cartContent}
      </Drawer>
    </Box>
  );
};

export default MobileRightSidebar;
