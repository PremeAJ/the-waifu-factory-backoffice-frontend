"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { BaseCard, BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { deleteFetcher, postFetcher } from "@/app/api/globalFetcher";
import { useNsfw } from "@/common/contexts/NsfwContext";
import type { SxProps, Theme } from "@mui/material/styles";
import type { CommissionPost } from "./types";

interface CommissionCardProps {
  item: CommissionPost;
  sx?: SxProps<Theme>;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ item, sx }) => {
  const router = useRouter();
  const theme = useTheme();
  const tagTextColor = theme.palette.mode === "dark" ? "#fff" : "#555";
  const { showNsfw } = useNsfw();
  const blurred = item.isNSFW && !showNsfw;

  const [liked,     setLiked]     = useState(item.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [liking,    setLiking]    = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      if (next) await postFetcher(`/api/commission/${item.id}/like`, {});
      else      await deleteFetcher(`/api/commission/${item.id}/like`, {});
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    } finally {
      setLiking(false);
    }
  };

  return (
    <BaseCard
      sx={{
        p: 0,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        touchAction: "pan-y",
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.22s, box-shadow 0.22s",
        "@media (hover: hover)": { "&:hover": { transform: "translateY(-6px)", boxShadow: "0px 0px 20px 6px rgba(0,0,0,0.15), 0px 8px 16px 0px rgba(0,0,0,0.14)" } },
        ...sx,
      }}
      onClick={() => router.push(`/commission/${item.id}`)}
    >
      {/* Image */}
      <Box sx={{ position: "relative", width: "100%", paddingTop: "100%", flexShrink: 0 }}>
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.title}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: blurred ? "blur(18px)" : undefined,
            transform: blurred ? "scale(1.05)" : undefined,
          }}
        />

        {blurred && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha("#000", 0.25) }}>
            <Typography variant="caption" fontWeight={700} sx={{ color: "#fff", bgcolor: alpha("#000", 0.45), px: 1.5, py: 0.5, borderRadius: 2 }}>
              🔞NSFW
            </Typography>
          </Box>
        )}

        {item.price != null && (
          <Box sx={{ position: "absolute", bottom: 8, right: 8, bgcolor: alpha("#000", 0.6), color: "#fff", px: 1, py: 0.3, borderRadius: 1.5, fontSize: 12, fontWeight: 700 }}>
            ${item.price.toLocaleString()}
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.6 }}>
        <Typography variant="body2" fontWeight={700} noWrap>{item.title}</Typography>

        <ArtistLink
          username={item.artist.username}
          displayName={item.artist.displayName}
          profilePictureUrl={item.artist.profilePictureUrl}
          avatarSize={20}
        />

        {item.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.tags.map((tag, i) => (
              <BaseChip key={i} label={tag.name} customBgColor={tag.color + "33"} customColor={tagTextColor} size="small" sx={{ fontSize: 10 }} />
            ))}
          </Box>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between" mt="auto">
          <Stack direction="row" alignItems="center" spacing={0.3}>
            <IconEye size={13} style={{ opacity: 0.5 }} />
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              {(item.viewCount ?? 0).toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.3}>
            <Typography variant="caption" color={liked ? "error.main" : "text.secondary"} lineHeight={1}>
              {likeCount.toLocaleString()}
            </Typography>
            <IconButton size="small" onClick={handleLike} disableRipple
              sx={{ p: 0.25, color: liked ? "error.main" : "text.secondary", "&:hover": { color: "error.main" } }}>
              {liked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  );
};

export default CommissionCard;
