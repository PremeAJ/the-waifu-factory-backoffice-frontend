"use client";
import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface ArtistLinkProps {
  username: string;
  displayName: string;
  profilePictureUrl?: string | null;
  /** Avatar diameter in px. Controls text size and padding automatically. */
  avatarSize?: number;
  /** Show @username below the display name */
  showUsername?: boolean;
  /** Extra element rendered at the right end (e.g. price, payment icons) */
  endSlot?: React.ReactNode;
  sx?: SxProps<Theme>;
  /** Override click — receives username, use to open external URL */
  onArtistClick?: (username: string) => void;
}

const ArtistLink = ({
  username,
  displayName,
  profilePictureUrl,
  avatarSize = 32,
  showUsername = false,
  endSlot,
  sx,
  onArtistClick,
}: ArtistLinkProps) => {
  const router = useRouter();
  const theme = useTheme();

  const isSmall = avatarSize < 36;
  const fontSize = Math.max(Math.round(avatarSize * 0.42), 10);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onArtistClick) {
      onArtistClick(username);
    } else {
      router.push(`/profile/${username}`);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={isSmall ? 0.8 : 1.5}
      sx={sx}
    >
      {/* Avatar — clickable */}
      <Avatar
        src={profilePictureUrl ?? undefined}
        onClick={handleClick}
        sx={{
          width: avatarSize,
          height: avatarSize,
          fontSize,
          flexShrink: 0,
          cursor: "pointer",
          transition: "opacity 0.15s",
          "&:hover": { opacity: 0.8 },
        }}
      >
        {displayName[0]}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Name — clickable typography only */}
        <Typography
          component="span"
          display="block"
          fontWeight={600}
          noWrap
          onClick={handleClick}
          sx={{
            fontSize: isSmall ? 11 : undefined,
            lineHeight: 1.25,
            cursor: "pointer",
            transition: "color 0.15s",
            "&:hover": { color: "primary.main", textDecoration: "underline" },
          }}
        >
          {displayName}
        </Typography>
        {showUsername && (
          <Typography variant="caption" color="text.secondary" display="block">
            @{username}
          </Typography>
        )}
      </Box>

      {endSlot}
    </Stack>
  );
};

export default ArtistLink;
