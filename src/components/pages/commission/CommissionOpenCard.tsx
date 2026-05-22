"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconCalendar, IconCurrencyDollar, IconUsers } from "@tabler/icons-react";
import { BaseCard, BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import type { SxProps, Theme } from "@mui/material/styles";
import type { CommissionOpenSlot } from "./types";

interface CommissionOpenCardProps {
  item: CommissionOpenSlot;
  sx?: SxProps<Theme>;
}

const CommissionOpenCard: React.FC<CommissionOpenCardProps> = ({ item, sx }) => {
  const theme = useTheme();
  const router = useRouter();
  const slotPct = item.maxSlots > 0 ? (item.currentSlots / item.maxSlots) * 100 : 0;
  const slotsLeft = item.maxSlots - item.currentSlots;
  const isFull = slotsLeft <= 0 || item.status === "closed";

  return (
    <BaseCard
      sx={{
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "@media (hover: hover)": { "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" } },
        ...sx,
      }}
    >
      {/* Header: artist + status */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <ArtistLink
          username={item.artist.username}
          displayName={item.artist.displayName}
          profilePictureUrl={item.artist.profilePictureUrl}
          avatarSize={36}
          showUsername
        />
        <BaseChip
          preset={item.status === "open" ? "open" : "close"}
          size="small"
          sx={{ fontWeight: 700, textTransform: "capitalize", flexShrink: 0 }}
        />
      </Stack>

      {/* Title */}
      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
          {item.title}
        </Typography>
        {item.description && (
          <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.description}
          </Typography>
        )}
      </Box>

      {/* Price + slots info */}
      <Stack direction="row" spacing={2}>
        {item.price != null && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconCurrencyDollar size={15} style={{ opacity: 0.6 }} />
            <Typography variant="body2" fontWeight={700} color="primary.main">
              ${item.price.toLocaleString()}
            </Typography>
          </Stack>
        )}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconUsers size={15} style={{ opacity: 0.6 }} />
          <Typography variant="body2" color="text.secondary">
            {item.currentSlots}/{item.maxSlots} slots
          </Typography>
        </Stack>
      </Stack>

      {/* Slot progress */}
      <Box>
        <LinearProgress
          variant="determinate"
          value={slotPct}
          color={isFull ? "error" : "primary"}
          sx={{ borderRadius: 4, height: 6, bgcolor: alpha(theme.palette.primary.main, 0.12) }}
        />
        <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
          {isFull ? "No slots available" : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} left`}
        </Typography>
      </Box>

      {/* Book button */}
      <Button
        variant={isFull ? "outlined" : "contained"}
        size="small"
        disabled={isFull}
        onClick={() => router.push(`/commission/open/${item.id}`)}
        sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
      >
        {isFull ? "Fully booked" : "View & Book"}
      </Button>
    </BaseCard>
  );
};

export default CommissionOpenCard;
