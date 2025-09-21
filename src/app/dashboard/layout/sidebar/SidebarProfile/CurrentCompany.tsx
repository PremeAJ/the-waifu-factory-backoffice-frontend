import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { IconTransfer } from "@tabler/icons-react";
import { useContext, useState } from "react";
import { useProfile } from "@/common/contexts/ProfileContext";
import CompanyAvatar from "@/common/components/avatar/CompanyAvatar";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";

export const CurrentCompany = () => {
  const { isLanguage } = useContext(CustomizerContext);
  const { activeCompany, loading, appearance } = useProfile();
  const { isCollapse } = appearance || {};
  const { name, logoUrl, businessTypeId, branchNameTh, branchNameEn } = activeCompany || {};
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { isSidebarHover } = useContext(CustomizerContext);
  const hideMenu = lgUp ? isCollapse == "mini_sidebar" && !isSidebarHover : "";

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
          <CompanyAvatar loading={loading} businessTypeId={businessTypeId || 0} imageUrl={logoUrl || ""} />
        ) : (
          <>
            <CompanyAvatar loading={loading} businessTypeId={businessTypeId || 0} imageUrl={logoUrl || ""} />
            <Box sx={{ maxWidth: 120, overflow: "hidden", pl: 0.5, borderRadius: 0 }}>
              <Typography variant="h6" noWrap>
                {loading ? <Skeleton variant="text" width={100} /> : name}
              </Typography>
              <Typography variant="caption">
                {loading ? <Skeleton variant="text" width={100} /> : `สาขา ${I18nString(isLanguage, branchNameTh, branchNameEn)}`}
              </Typography>
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
