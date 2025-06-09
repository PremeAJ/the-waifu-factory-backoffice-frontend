import ConfirmSignOutDialog from "@/components/auth/dialog/ConfirmSignOutDialog";
import { AuthContext } from "@/context/AuthContext";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { UserContext } from "@/context/UserContext";
import { Avatar, Box, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { IconPower } from "@tabler/icons-react";
import { useContext, useState } from "react";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const { signOut } = useContext(AuthContext);
  const { firstName, avatarUrl } = user || {};
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const hideMenu = lgUp ? isCollapse == "mini-sidebar" && !isSidebarHover : "";

  const [openSignOut, setOpenSignOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => setOpenSignOut(true);

  const handleConfirmSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    setOpenSignOut(false);
    window.location.reload();
  };

  return (
    <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3, p: 2, bgcolor: `${"secondary.light"}` }}>
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={avatarUrl || "/images/profile/user-1.jpg"} sx={{ height: 40, width: 40 }} />

          <Box>
            <Typography variant="h6">{firstName}</Typography>
            <Typography variant="caption">Designer</Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
          <ConfirmSignOutDialog
            open={openSignOut}
            onConfirm={handleConfirmSignOut}
            onClose={() => setOpenSignOut(false)}
            loading={loading}
          />
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
