"use client";
import React from "react";
import Cookies from "js-cookie";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import { BaseCard, BaseChip } from "@/common/components/base";
import type { SxProps, Theme } from "@mui/material/styles";
import { CookiesKey } from "@/common/constants/cookies";

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
  externalUrl?: string;
  artist: AdoptableUser;
  owner: AdoptableUser;
  status: "open" | "close" | "resell";
  price?: number;
  createdAt: string;
  tags: AdoptableTag[];
  /** Explicit NSFW flag from API — also auto-detected from tags named "nsfw" */
  isNSFW?: boolean;
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
  const theme = useTheme();
  const tagTextColor = theme.palette.mode === "dark" ? "#fff" : "#555";
  // Read NSFW blur preference from cookie (default true = blur)
  let showNsfw = true;
  if (typeof window !== "undefined") {
    const cookie = Cookies.get(CookiesKey.NSFW_MODE);
    showNsfw = cookie === "true";
  }
  // Only blur if showNsfw is false and item is NSFW
  const blurred = !showNsfw && isAdoptableNsfw(item);

  return (
    <BaseCard
      sx={{
        p: 0,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: item.externalUrl ? "pointer" : "default",
        transition: "transform 0.22s, box-shadow 0.22s",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "0px 0px 20px 6px rgba(0,0,0,0.15), 0px 8px 16px 0px rgba(0,0,0,0.14)" },
        ...sx,
      }}
      onClick={() => item.externalUrl && window.open(item.externalUrl, "_blank")}
    >
      {/* ── Image ── */}
      <Box sx={{ position: "relative", width: "100%", paddingTop: "120%", flexShrink: 0 }}>
        {/* NSFW blur — applied directly on image (cheaper than backdropFilter) */}
        <Image
          src={item.imageUrl}
          alt={`Adoptable #${item.number}`}
          fill
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
        <BaseChip preset={item.status} size="small" sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700, textTransform: "capitalize" }} />

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
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Avatar src={item.artist.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>
            {item.artist.displayName[0]}
          </Avatar>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0, fontSize: 11 }}>
            {item.artist.displayName}
          </Typography>
          {item.price != null && (
            <Typography variant="caption" fontWeight={800} color="primary.main" flexShrink={0}>
              ฿{item.price.toLocaleString()}
            </Typography>
          )}
        </Stack>

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

        {/* View post button */}
        {showViewPost && item.externalUrl && (
          <Box mt="auto" pt={0.5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              endIcon={<IconExternalLink size={14} />}
              href={item.externalUrl}
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
