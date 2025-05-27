import React, { useContext, useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import * as dropdownData from "../../dashboard/(Layout)/layout/vertical/header/data";

import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import { UserContext } from "@/app/context/UserContext";

const ProfileSkeleton = () => (
  <Box>
    <IconButton
      aria-label="profile loading"
      color="inherit"
      sx={{ padding: "5px" }}
    >
      <Skeleton variant="circular" width={35} height={35} animation="wave" />
    </IconButton>
  </Box>
);

const Profile = () => {
  const { signOut } = useContext(AuthContext);
  const { user, loading } = useContext(UserContext);
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  if (loading) {
    return <ProfileSkeleton />;
  } else if (!user) {
    return null;
  }
  const { email, avatarUrl, firstname, lastname } = user;
  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

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
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
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
          <Avatar
            src={avatarUrl ?? "/images/profile/user-1.jpg"}
            alt={"ProfileImg"}
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              {firstname || lastname
                ? `${firstname ?? ""} ${lastname ?? ""}`.trim()
                : "-"}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Designer
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {email ?? "-"}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
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
          {/* <Box
            bgcolor="primary.light"
            p={3}
            mb={3}
            overflow="hidden"
            position="relative"
          >
            <Box display="flex" justifyContent="space-between">
              <Box sx={{ zIndex: 1 }}>
                <Typography variant="h5" mb={2}>
                  Unlimited <br />
                  Access
                </Typography>
                <Button variant="contained" color="primary">
                  Upgrade
                </Button>
              </Box>
              <Image
                src={"/images/backgrounds/unlimited-bg.png"}
                width={150}
                height={183}
                style={{ height: "auto", width: "auto", zIndex: 0 }}
                alt="unlimited"
                className="signup-bg"
              />
            </Box>
          </Box> */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
            loading={loading}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
