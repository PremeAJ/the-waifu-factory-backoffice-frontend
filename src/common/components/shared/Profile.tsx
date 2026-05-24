import { Avatar, Box, Divider, IconButton, Menu, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { IconMail, IconUser, IconLogout } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { usePathname } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import * as dropdownData from "../FAB/AppShortcutButton/data";
import BaseAvatar from "@/common/components/base/BaseAvatar";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import ConfirmSignOutDialog from "@/common/components/dialogs/ConfirmSignOutDialog";
import Link from "next/link";
import React, { FC, useRef, useState ,useEffect} from "react";

interface ProfileProps {
  loading?: boolean;
}

const Profile: FC<ProfileProps> = () => {
  const theme = useTheme();
  const { activeCompany, appearance } = useProfile();
  const { isLanguage } = appearance || {};
  const { roleNameTh, roleNameEn } = activeCompany || {};
  const { user, isLoading, signOut: waifuSignOut } = useCurrentUser();
  const loading = isLoading;
  const [openSignOut, setOpenSignOut] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const anchorBtnRef = useRef<HTMLButtonElement | null>(null);
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget as HTMLElement);
  };

  const avatar: string = user?.profilePictureUrl ?? "";
  const firstName: string = user?.displayName ?? user?.username ?? "";
  const fullName: string = user?.displayName ?? "";
  const email: string = "";

  const renderIcon = (IconCmp: any) => {
    if (!IconCmp) return null;
    if (React.isValidElement(IconCmp)) return IconCmp;
    try {
      const C = IconCmp as React.ComponentType<any>;
      return <C size={20} />;
    } catch {
      return null;
    }
  };

  const handleLogout = () => setOpenSignOut(true);
  const handleConfirmSignOut = async () => {
    try {
      setSignOutLoading(true);
      await waifuSignOut();
    } finally {
      setSignOutLoading(false);
      setOpenSignOut(false);
    }
  };

  const pathname = usePathname();

  useEffect(() => {
    setAnchorEl2(null);
  }, [pathname]);

  if (!user) return null;

  return (
    <Box>
      <Box
        ref={anchorBtnRef}
        onClick={handleClick2}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.2,
          py: 0.5,
          borderRadius: "999px",
          border: "1.5px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "box-shadow 0.2s, border-color 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 0 5 0px",
            boxShadowColor: "primary.light",
          },
          ...(Boolean(anchorEl2) && {
            borderColor: "primary.main",
          }),
        }}
      >
        <BaseAvatar
          src={avatar || "/images/profile/user-1.jpg"}
          alt={firstName}
          size={32}
          lightbox={false}
        />
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ maxWidth: 120, color: "text.primary" }}
        >
          {firstName}
        </Typography>
      </Box>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
        disableAutoFocusItem
        disableEnforceFocus
        disableRestoreFocus
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "360px", p: 4 } }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <BaseAvatar
            src={avatar || "/images/profile/user-1.jpg"}
            alt={firstName}
            size={95}
            lightbox
            caption={fullName || email || ""}
            stopPropagationOnLightbox
          />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {fullName}
            </Typography>
            {false && (
              <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                <IconUser size={15} stroke={1.5} color={theme.palette.text.secondary} />
                <Box sx={{ maxWidth: 160, overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "100%",
                      display: "block",
                    }}
                  >
                    {I18nString(isLanguage, roleNameTh, roleNameEn)}
                  </Typography>
                </Box>
              </Typography>
            )}
            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
              <IconMail size={15} stroke={1.5} color={theme.palette.text.secondary} />
              <Box sx={{ maxWidth: 160, overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    maxWidth: "100%",
                    display: "block",
                  }}
                >
                  {email || "-"}
                </Typography>
              </Box>
            </Typography>
          </Box>
        </Stack>
        <Box mt={2}>
          <BaseButton
            label="Logout"
            onClick={handleLogout}
            loading={loading}
            endIcon={<IconLogout size={18} />}
          />
        </Box>
      </Menu>

      <ConfirmSignOutDialog
        open={openSignOut}
        onClose={() => setOpenSignOut(false)}
        onConfirm={handleConfirmSignOut}
        loading={signOutLoading}
      />
    </Box>
  );
};

export default Profile;
