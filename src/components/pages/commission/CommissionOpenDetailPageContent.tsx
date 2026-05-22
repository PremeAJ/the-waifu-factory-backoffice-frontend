"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconArrowLeft, IconCalendar, IconCurrencyDollar, IconUsers } from "@tabler/icons-react";
import { BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import type { CommissionOpenSlot } from "./types";

const CommissionOpenDetailPageContent = ({ id }: { id: string }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [booking,  setBooking]  = useState(false);
  const [booked,   setBooked]   = useState(false);
  const [bookErr,  setBookErr]  = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR(`/api/commission/open/${id}`, getFetcher, { revalidateOnFocus: false });
  const item: CommissionOpenSlot | undefined = data?.data;

  const handleBook = async () => {
    if (booking) return;
    setBooking(true);
    setBookErr(null);
    try {
      const res = await postFetcher(`/api/commission/open/${id}/book`, {});
      if (res?.isSuccess) { setBooked(true); mutate(); }
      else setBookErr(res?.message ?? "Failed to book slot");
    } catch {
      setBookErr("Something went wrong. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Commission slot not found</Typography>
      </Container>
    );
  }

  const slotsLeft  = item.maxSlots - item.currentSlots;
  const slotPct    = item.maxSlots > 0 ? (item.currentSlots / item.maxSlots) * 100 : 0;
  const isFull     = slotsLeft <= 0 || item.status === "closed";
  const isOwn      = user?.username === item.artist.username;

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Button
        startIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        sx={{ textTransform: "none", mb: 3, color: "text.secondary" }}
      >
        Back
      </Button>

      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>

        {/* Status bar */}
        <Box sx={{
          px: 3, py: 1.75,
          bgcolor: item.status === "open" ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <BaseChip preset={item.status === "open" ? "open" : "close"} sx={{ fontWeight: 700, textTransform: "capitalize" }} />
          <Typography variant="caption" color="text.secondary">
            {new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Title */}
          <Typography variant="h5" fontWeight={800} mb={0.5}>{item.title}</Typography>

          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 2.5 }}>
              {item.description}
            </Typography>
          )}

          <Divider sx={{ mb: 2.5 }} />

          {/* Artist */}
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>Artist</Typography>
          <ArtistLink
            username={item.artist.username}
            displayName={item.artist.displayName}
            profilePictureUrl={item.artist.profilePictureUrl}
            avatarSize={44}
            showUsername
            sx={{ mt: 1.25, mb: 2.5 }}
          />

          <Divider sx={{ mb: 2.5 }} />

          {/* Price + slots */}
          <Stack spacing={1.5} mb={2.5}>
            {item.price != null && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconCurrencyDollar size={18} style={{ opacity: 0.6 }} />
                <Typography variant="body1" fontWeight={700} color="primary.main">
                  ${item.price.toLocaleString()} per slot
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconUsers size={18} style={{ opacity: 0.6 }} />
              <Typography variant="body2" color="text.secondary">
                {item.currentSlots} / {item.maxSlots} slots booked
              </Typography>
            </Stack>
          </Stack>

          {/* Progress */}
          <Box mb={3}>
            <LinearProgress
              variant="determinate"
              value={slotPct}
              color={isFull ? "error" : "primary"}
              sx={{ borderRadius: 4, height: 8, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.75} display="block">
              {isFull ? "All slots are taken" : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining`}
            </Typography>
          </Box>

          {/* Book button */}
          {!isOwn && (
            <>
              {booked ? (
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1), textAlign: "center" }}>
                  <Typography fontWeight={700} color="success.main">Slot booked! The artist will contact you soon.</Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isFull || booking || !user}
                  onClick={handleBook}
                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, py: 1.5 }}
                >
                  {booking ? <CircularProgress size={20} color="inherit" /> : isFull ? "Fully Booked" : !user ? "Login to Book" : "Book This Slot"}
                </Button>
              )}
              {bookErr && <Typography variant="body2" color="error" mt={1}>{bookErr}</Typography>}
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
};

export default CommissionOpenDetailPageContent;
