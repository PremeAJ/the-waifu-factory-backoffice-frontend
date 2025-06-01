import React, { useContext, useState } from "react";
import Link from "next/link";
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, Skeleton } from "@mui/material";
import * as dropdownData from "../../dashboard/(Layout)/layout/vertical/header/data";

import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { AuthContext } from "@/app/context/AuthContext";
import { UserContext } from "@/app/context/UserContext";

const Profile = () => {
  const { signOut } = useContext(AuthContext);
  const { user, loading } = useContext(UserContext);
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  if (!user) {
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
          <Avatar src={avatarUrl ?? "/images/profile/user-1.jpg"} alt={"ProfileImg"} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {firstname || lastname ? `${firstname ?? ""} ${lastname ?? ""}`.trim() : "-"}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Designer
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
              <IconMail width={15} height={15} />
              {email ?? "-"}
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
                    borderRadius={2}
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
          <Button variant="outlined" color="primary" fullWidth onClick={handleLogout} loading={loading}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
