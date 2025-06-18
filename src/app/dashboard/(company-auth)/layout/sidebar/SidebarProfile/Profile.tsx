import CompanyAvatar from "@/components/avatar/CompanyAvatar";
import SelectCompanyDialog from "@/components/base/Dialog/SelectCompanyDialog";
import { CompanyContext } from "@/context/CompanyContext";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { UserContext } from "@/context/UserContext";
import { Avatar, Box, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { IconTransfer } from "@tabler/icons-react";
import { useContext, useState } from "react";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const { company } = useContext(CompanyContext);
  const { name, logoUrl, businessTypeId } = company || {};
  const { firstName, avatarUrl } = user || {};
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const hideMenu = lgUp ? isCollapse == "mini-sidebar" && !isSidebarHover : "";

  const [openSwitchCompany, setOpenSwitchCompany] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Box
        display={"flex"}
        alignItems="center"
        gap={2}
        sx={{
          m: 3,
          p: hideMenu ? 0 : 2,
          bgcolor: hideMenu ? "none" : "secondary.light",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setOpenSwitchCompany(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hideMenu ? (
          <CompanyAvatar businessTypeId={businessTypeId || 0} imageUrl={logoUrl} />
        ) : (
          <>
            <CompanyAvatar businessTypeId={businessTypeId || 0} imageUrl={logoUrl} />
            <Box>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="caption">Designer</Typography>
            </Box>
          </>
        )}
        {!hideMenu && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.35)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              pointerEvents: "none",
              fontWeight: "bold",
              fontSize: 18,
              gap: 1,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.98)",
              transition: "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <IconTransfer
              size={20}
              style={{
                transition: "transform 0.4s cubic-bezier(.4,0,.2,1)",
                transform: hovered ? "scale(1.2)" : "scale(1)",
              }}
            />
            <Typography variant="subtitle1" fontWeight="bold">
              เปลี่ยนบริษัท
            </Typography>
          </Box>
        )}
      </Box>
      <SelectCompanyDialog open={openSwitchCompany} onClose={() => setOpenSwitchCompany(false)} />
    </>
  );
};
