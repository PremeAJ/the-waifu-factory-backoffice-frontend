"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconClock, IconFlame } from "@tabler/icons-react";
import Image from "next/image";
import { BaseCard, BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { CookiesKey } from "@/common/constants/cookies";
import type { AuctionItem } from "./types";
import type { SxProps, Theme } from "@mui/material/styles";

export function timeRemaining(endTime: string): { label: string; isUrgent: boolean; isEnded: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { label: "Ended", isUrgent: false, isEnded: true };
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h < 24) return { label: `${h}h ${m}m`, isUrgent: h < 6, isEnded: false };
  const d = Math.floor(h / 24);
  return { label: `${d}d ${h % 24}h`, isUrgent: false, isEnded: false };
}

interface AuctionCardProps {
  item: AuctionItem;
  sx?: SxProps<Theme>;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ item, sx }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tagTextColor = isDark ? "#fff" : "#555";

  let showNsfw = true;
  if (typeof window !== "undefined") {
    showNsfw = Cookies.get(CookiesKey.NSFW_MODE) === "true";
  }
  const blurred = !showNsfw && !!item.isNSFW;
  const { label: timeLabel, isUrgent, isEnded } = timeRemaining(item.endTime);
  const nextBid = item.currentBid != null ? item.currentBid + item.minIncrement : item.startingBid;

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
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0px 0px 20px 6px rgba(0,0,0,0.15), 0px 8px 16px 0px rgba(0,0,0,0.14)",
          },
        },
        ...sx,
      }}
      onClick={() => router.push(`/auctions/${item.id}`)}
    >
      {/* ── Image ── */}
      <Box sx={{ position: "relative", width: "100%", paddingTop: "120%", flexShrink: 0 }}>
        <Image
          src={item.thumbnailUrl ?? item.imageUrl}
          alt={`Auction #${item.number}`}
          fill
          loading="eager"
          style={{
            objectFit: "cover",
            filter: blurred ? "blur(18px)" : undefined,
            transform: blurred ? "scale(1.05)" : undefined,
          }}
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
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "#fff", bgcolor: alpha("#000", 0.45), px: 1.5, py: 0.5, borderRadius: 2 }}
            >
              🔞NSFW
            </Typography>
          </Box>
        )}

        {/* Status badge */}
        <BaseChip
          preset={item.status === "open" ? "open" : "close"}
          label={item.status === "open" ? "Auction" : item.status === "sold" ? "Sold" : "Closed"}
          size="small"
          sx={{ zIndex: 9, position: "absolute", top: 8, left: 8, fontWeight: 700, textTransform: "capitalize" }}
        />

        {/* #number */}
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
            zIndex: 9,
          }}
        >
          #{item.number}
        </Box>

        {/* Time remaining */}
        {!isEnded && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              zIndex: 9,
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              bgcolor: isUrgent ? alpha(theme.palette.error.main, 0.9) : alpha("#000", 0.65),
              color: "#fff",
              px: 1,
              py: 0.3,
              borderRadius: 1.5,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {isUrgent ? <IconFlame size={11} /> : <IconClock size={11} />}
            {timeLabel}
          </Box>
        )}

        {/* Ended overlay */}
        {isEnded && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: alpha("#000", 0.5),
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight={800} sx={{ color: "#fff", fontSize: 18, letterSpacing: 2 }}>
              ENDED
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Body ── */}
      <Box sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {/* Artist */}
        <ArtistLink
          username={item.artist.username}
          displayName={item.artist.displayName}
          profilePictureUrl={item.artist.profilePictureUrl}
          avatarSize={24}
        />

        <Divider sx={{ my: 0.25 }} />

        {/* SB / MI / AB */}
        <Stack direction="row" alignItems="flex-start" spacing={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
              SB
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              ${item.startingBid}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
              MI
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              ${item.minIncrement}
            </Typography>
          </Box>
          {item.autoBuy != null && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                AB
              </Typography>
              <Typography variant="caption" fontWeight={700} color="primary.main">
                ${item.autoBuy}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Current bid */}
        {item.currentBid != null ? (
          <Typography variant="caption" color="text.secondary">
            Bid:{" "}
            <Box component="span" fontWeight={700} color="primary.main">
              ${item.currentBid.toLocaleString()}
            </Box>
            {"  "}
            <Box component="span" sx={{ opacity: 0.6 }}>
              ({item.bidCount} bid{item.bidCount !== 1 ? "s" : ""})
            </Box>
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary" fontStyle="italic">
            No bids yet — SB ${item.startingBid}
          </Typography>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.tags.map((tag, i) => (
              <BaseChip
                key={i}
                label={tag.name}
                customBgColor={tag.color + "33"}
                customColor={tagTextColor}
                size="small"
                sx={{ fontSize: 10 }}
              />
            ))}
          </Box>
        )}

        {/* Bid button */}
        {!isEnded && item.status === "open" && (
          <Box mt="auto" pt={0.5}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/auctions/${item.id}`);
              }}
              sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 700 }}
            >
              Bid ${nextBid.toLocaleString()}+
            </Button>
          </Box>
        )}
      </Box>
    </BaseCard>
  );
};

export default AuctionCard;
