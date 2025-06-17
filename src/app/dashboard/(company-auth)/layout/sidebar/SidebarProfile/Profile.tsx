import SelectCompanyDialog from "@/components/base/Dialog/SelectCompanyDialog";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { UserContext } from "@/context/UserContext";
import { Avatar, Box, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { IconTransfer } from "@tabler/icons-react";
import { useContext, useState } from "react";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const { firstName, avatarUrl } = user || {};
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const hideMenu = lgUp ? isCollapse == "mini-sidebar" && !isSidebarHover : "";

  const [openSwitchCompany, setOpenSwitchCompany] = useState(false); 

  return (
    <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3, p: hideMenu ? 0 : 2, bgcolor: hideMenu ? "none" : `${"secondary.light"}` }}>
      {hideMenu ? (
        <Avatar alt="Remy Sharp" src={avatarUrl || "/images/profile/user-1.jpg"} sx={{ height: 40, width: 40 }} />
      ) : (
        <>
          <Avatar alt="Remy Sharp" src={avatarUrl || "/images/profile/user-1.jpg"} sx={{ height: 40, width: 40 }} />
          <Box>
            <Typography variant="h6">{firstName}</Typography>
            <Typography variant="caption">Designer</Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Tooltip title="เปลี่ยนบริษัท" placement="top">
              <IconButton color="primary" onClick={() => setOpenSwitchCompany(true)} aria-label="switch-account" size="small">
                <IconTransfer size="20" />
              </IconButton>
            </Tooltip>
          </Box>
          <SelectCompanyDialog open={openSwitchCompany} onClose={() => setOpenSwitchCompany(false)} />
        </>
      )}
    </Box>
  );
};
