import React, { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { IconSearch, IconX } from "@tabler/icons-react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import AppLinks from "@/app/dashboard/layout/header/AppLinks";

const AppShortcutDrawer = () => {
  const { appShortcutisOpen, closeAppShortcut } = useSidebarState();
  const [searchApp, setSearchApp] = useState("");
  const isMobile = useIsMobile();

  const appContent = (
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
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={appShortcutisOpen}
      onClose={closeAppShortcut}
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
        <IconButton onClick={closeAppShortcut}>
          <IconX size={18} />
        </IconButton>
      </Box>
      {appContent}
    </Drawer>
  );
};

export default AppShortcutDrawer;