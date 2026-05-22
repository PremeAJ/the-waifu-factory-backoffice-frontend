"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useNsfw } from "@/common/contexts/NsfwContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconExternalLink, IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { BaseCard, BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { deleteFetcher, postFetcher } from "@/app/api/globalFetcher";
import type { SxProps, Theme } from "@mui/material/styles";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdoptableUser {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  paymentMethods?: { name: string; iconUrl: string; accountValue: string }[];
}

export interface AdoptableTag {
  name: string;
  color: string;
  category: { name: string; color: string };
}

export interface AdoptableListItem {
  id: string;
  number: number;
  imageUrl: string;
  postUrl?: string;
  artist: AdoptableUser;
  owner: AdoptableUser;
  status: "open" | "close" | "resell";
  price?: number;
  createdAt: string;
  tags: AdoptableTag[];
  /** Explicit NSFW flag from API — also auto-detected from tags named "nsfw" */
  isNSFW?: boolean;
  viewCount?: number;
  likeCount?: number;
  isLiked?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export const isAdoptableNsfw = (item: AdoptableListItem): boolean => !!item.isNSFW || item.tags.some((t) => t.name.toLowerCase() === "nsfw");

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AdoptableCardProps {
  item: AdoptableListItem;
  /** When true (SFW mode), NSFW images are blurred. Default: true */
  sfw?: boolean;
  /** Extra sx applied to the BaseCard root */
  sx?: SxProps<Theme>;
  /** Whether to show the "View post" button at the bottom. Default: true */
  showViewPost?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AdoptableCard: React.FC<AdoptableCardProps> = ({ item, sfw = true, sx, showViewPost = true }) => {
  const router = useRouter();
  const theme = useTheme();
  const tagTextColor = theme.palette.mode === "dark" ? "#fff" : "#555";
  const { showNsfw } = useNsfw();
  const blurred = !showNsfw && isAdoptableNsfw(item);

  const [liked, setLiked] = useState(item.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [liking, setLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      if (next) {
        await postFetcher(`/api/adoptable/${item.id}/like`, {});
      } else {
        await deleteFetcher(`/api/adoptable/${item.id}/like`, {});
      }
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
      onClick={() => router.push(`/adoptables/${item.id}`)}
    >
      {/* ── Image ── */}
      <Box sx={{ position: "relative", width: "100%", paddingTop: "120%", flexShrink: 0 }}>
        {/* NSFW blur — applied directly on image (cheaper than backdropFilter) */}
        <Image
          src={item.imageUrl}
          alt={`Adoptable #${item.number}`}
          fill
          loading="eager"
          style={{ objectFit: "cover", filter: blurred ? "blur(18px)" : undefined, transform: blurred ? "scale(1.05)" : undefined }}
          unoptimized
        />

        {blurred && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha("#000", 0.25),
            }}
          >
            <Typography variant="caption" fontWeight={700} sx={{ color: "#fff", bgcolor: alpha("#000", 0.45), px: 1.5, py: 0.5, borderRadius: 2 }}>
              🔞NSFW
            </Typography>
          </Box>
        )}

        {/* Status badge */}
        <BaseChip preset={item.status} size="small" sx={{ zIndex: 999, position: "absolute", top: 8, left: 8, fontWeight: 700, textTransform: "capitalize" }} />

        {/* Number badge */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: alpha("#000", 0.55),
            color: "#fff",
            px: 1,
            py: 0.2,
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          #{item.number}
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.8 }}>
        {/* Artist row */}
        <ArtistLink
          username={item.artist.username}
          displayName={item.artist.displayName}
          profilePictureUrl={item.artist.profilePictureUrl}
          avatarSize={24}
          endSlot={
            item.price != null ? (
              <Typography variant="caption" fontSize={18} fontWeight={800} color="primary.main" flexShrink={0}>
                {item.price.toLocaleString()} $
              </Typography>
            ) : undefined
          }
        />

        {/* Tags */}
        {item.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.tags.map((tag: AdoptableTag, index: number) => (
              <BaseChip
                key={`${tag.name || "tag"}-${index}`}
                label={tag.name}
                customBgColor={tag.color + "33"}
                customColor={tagTextColor}
                size="small"
                sx={{ fontSize: 10 }}
              />
            ))}
          </Box>
        )}

        {/* Payment method icons */}
        {item.artist.paymentMethods && item.artist.paymentMethods.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {item.artist.paymentMethods.map((pm: { name: string; iconUrl: string }, index: number) => (
              <Box
                key={pm.iconUrl || index}
                component="img"
                src={pm.iconUrl}
                alt={pm.name || "payment-method"}
                title={pm.name || "Payment method"}
                sx={{ height: 16, width: "auto", objectFit: "contain" }}
              />
            ))}
          </Stack>
        )}

        {/* Like & View row */}
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
            <IconButton
              size="small"
              onClick={handleLike}
              disableRipple
              sx={{ p: 0.25, color: liked ? "error.main" : "text.secondary", "&:hover": { color: "error.main" } }}
            >
              {liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
            </IconButton>
          </Stack>
        </Stack>

        {/* View post button */}
        {showViewPost && item.postUrl && (
          <Box pt={0.5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              endIcon={<IconExternalLink size={14} />}
              href={item.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{ borderRadius: 2, textTransform: "none", fontSize: 12 }}
            >
              View post
            </Button>
          </Box>
        )}
      </Box>
    </BaseCard>
  );
};

export default AdoptableCard;
