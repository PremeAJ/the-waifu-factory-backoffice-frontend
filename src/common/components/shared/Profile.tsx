import { Box, Menu, Avatar, Typography, Divider, IconButton, Skeleton, Stack, useTheme } from "@mui/material";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { IconMail, IconUser } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { signOut, useSession } from "next-auth/react";
import { useAuth } from "@/common/contexts/AuthContext";
import { UserContext } from "@/common/contexts/UserContext";
import { useRouter } from "next/navigation";
import * as dropdownData from "../../../app/dashboard/layout/header/data";
import BaseButton from "@/common/components/base/BaseButton";
import ConfirmSignOutDialog from "@/common/components/dialogs/ConfirmSignOutDialog";
import Link from "next/link";
import React, { useContext, useState } from "react";

interface ProfileProps {
  loading?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ loading: loadingProp }) => {
  const router = useRouter();
  const theme = useTheme();
  const { isLanguage } = useContext(CustomizerContext);
  const { user } = useContext(UserContext);
  const { data: session, status } = useSession();
  const {signOut: apiSignOut} = useAuth()
  const loading = status === "loading";
  const { companies } = user || {};
  const { companyUsers } = companies || {};
  const { roles } = companyUsers?.[0] || {};
  const { nameTh: roleNameTh, nameEn: roleNameEn } = roles || {};
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
    await apiSignOut()
    await signOut({callbackUrl: PageUrl.AUTH_SIGN_IN});
    setSignOutLoading(false);
    setOpenSignOut(false);
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
      return <IconComponent size={24} stroke={1.5} color={theme.palette.primary.main} />;
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
  if (!session) {
    return null;
  }
  const {firstName, lastName, fullName ,email, avatar} = session.profile || {};

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
          src={avatar ?? "/images/profile/user-1.jpg"}
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
          <Avatar src={avatar ?? "/images/profile/user-1.jpg"} alt={firstName} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {fullName}
            </Typography>
            {companies && (
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
              <Link href={profile.href} >
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
                      bgcolor: (theme) => theme.palette.primary.light,
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
