import React, { useContext, useState } from "react";
import Link from "next/link";
import { Box, Menu, Avatar, Typography, Divider, IconButton, Skeleton, Stack } from "@mui/material";
import * as dropdownData from "../../app/dashboard/(company-auth)/(dashboard)/layout/header/data";
import { IconMail, IconUser } from "@tabler/icons-react";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import BaseButton from "../base/BaseButton";
import ConfirmSignOutDialog from "@/components/auth/dialog/ConfirmSignOutDialog";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { I18nString } from "@/utils/i18n/I18nString";

interface ProfileProps {
  loading?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ loading: loadingProp }) => {
  const { signOut } = useContext(AuthContext);
  const { isLanguage } = useContext(CustomizerContext);
  const { user } = useContext(UserContext);
  const { companies } = user || {};
  const { companyUsers } = companies || {};
  const { roles } = companyUsers?.[0] || {};
  const { nameTh: roleNameTh, nameEn: roleNameEn } = roles || {};
  const loading = loadingProp;
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);

  const [openSignOut, setOpenSignOut] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    setOpenSignOut(true);
  };

  const handleConfirmSignOut = async () => {
    setSignOutLoading(true);
    await signOut();
    setSignOutLoading(false);
    setOpenSignOut(false);
    window.location.reload();
  };

  const renderIcon = (icon: any) => {
    if (typeof icon === "string") {
      return (
        <Avatar
          src={icon}
          alt="icon"
          sx={{
            width: 24,
            height: 24,
            borderRadius: 0,
          }}
        />
      );
    } else {
      const IconComponent = icon;
      return <IconComponent size={24} stroke={1.5} />;
    }
  };
  if (loading) {
    return (
      <Box>
        <IconButton color="inherit">
          <Skeleton variant="circular" width={35} height={35} />
        </IconButton>
        <Menu
          open={Boolean(anchorEl2)}
          anchorEl={anchorEl2}
          sx={{
            "& .MuiMenu-paper": {
              width: "360px",
              p: 4,
            },
          }}
          PaperProps={{ style: { pointerEvents: "none" } }}
        >
          <Typography variant="h5">
            <Skeleton width={120} />
          </Typography>
          <Stack direction="row" py={3} spacing={2} alignItems="center">
            <Skeleton variant="circular" width={95} height={95} />
            <Box>
              <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                <Skeleton width={120} />
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                <Skeleton width={80} />
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                <Skeleton width={140} />
              </Typography>
            </Box>
          </Stack>
          <Divider />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ py: 2 }}>
              <Stack direction="row" spacing={2}>
                <Skeleton variant="rectangular" width={45} height={45} sx={{ borderRadius: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="textPrimary">
                    <Skeleton width={120} />
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    <Skeleton width={100} />
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
          <Box mt={2}>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
          </Box>
        </Menu>
      </Box>
    );
  }

  // --- Normal UI ---
  if (!user) {
    return null;
  }
  const { avatarUrl, firstName, lastName, users } = user;
  const { email } = users || {};

  return (
    <Box>
      <IconButton
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={avatarUrl ?? "/images/profile/user-1.jpg"}
          alt={firstName}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={avatarUrl ?? "/images/profile/user-1.jpg"} alt={firstName} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {firstName || lastName ? `${firstName ?? ""} ${lastName ?? ""}`.trim() : "-"}
            </Typography>
            {companies && <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
              <IconUser width={15} height={15} />
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
            </Typography>}
            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
              <IconMail width={15} height={15} />
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
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box
              sx={{
                py: 2,
                px: 0,
                cursor: "pointer",
                "&:hover .profile-icon-box": {
                  bgcolor: "primary.main",
                  transform: "scale(1.07)",
                  transition: "all 0.18s",
                  "& svg": {
                    color: "#fff",
                  },
                },
                "&:active .profile-icon-box": {
                  bgcolor: "primary.dark",
                  transform: "scale(0.96)",
                },
              }}
              className="hover-text-primary"
            >
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    className="profile-icon-box"
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                    sx={{
                      transition: "all 0.18s",
                      "& svg": {
                        color: "primary.main",
                        transition: "color 0.18s",
                      },
                    }}
                  >
                    {renderIcon(profile.icon)}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: "240px",
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: "240px",
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <BaseButton label="Logout" onClick={handleLogout} loading={loading} />
        </Box>
      </Menu>
      <ConfirmSignOutDialog open={openSignOut} onClose={() => setOpenSignOut(false)} onConfirm={handleConfirmSignOut} loading={signOutLoading} />
    </Box>
  );
};

export default Profile;
