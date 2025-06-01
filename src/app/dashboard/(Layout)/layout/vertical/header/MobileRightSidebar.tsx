import React, { useState } from "react";
import { IconCalendarEvent, IconGridDots, IconMail, IconMessages, IconSearch, IconX } from "@tabler/icons-react";
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";

import Link from "next/link";
import AppLinks from "./AppLinks";

const MobileRightSidebar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [open, setOpen] = React.useState(true);
  const [searchApp, setSearchApp] = useState("");

  const handleClick = () => {
    setOpen(!open);
  };

  const cartContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Search Bar */}
      <Box px={3} pt={2} pb={2}>
        <TextField
          fullWidth
          placeholder="Search apps..."
          value={searchApp}
          onChange={(e) => setSearchApp(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
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
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Apps Grid */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Box px={3} pb={3}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight={500} mb={2}>
            Applications
          </Typography>
          <AppLinks searchApp={searchApp} /> {/* ส่ง searchTerm เข้าไป */}
        </Box>

        <Divider />

        {/* Frequently Used Apps */}
        <Box px={3} pt={2}>
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
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => setShowDrawer(true)}
        sx={{
          ...(showDrawer && {
            color: "primary.main",
          }),
        }}
      >
        <IconGridDots size="21" stroke="1.5" />
      </IconButton>

      {/* Apps Drawer */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: "350px" },
              maxWidth: "100%",
            },
          },
        }}
      >
        <Box p={2} pb={0} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={600}>
            Apps
          </Typography>
          <IconButton onClick={() => setShowDrawer(false)}>
            <IconX size={18} />
          </IconButton>
        </Box>

        {/* component */}
        {cartContent}
      </Drawer>
    </Box>
  );
};

export default MobileRightSidebar;
