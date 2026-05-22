"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { getFetcher, patchFetcher, postFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
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
import {
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import type { CommissionOpenSlot } from "./types";

interface QueueItem {
  id: string;
  user: { username: string; displayName: string; profilePictureUrl: string | null };
  status: "pending" | "accepted" | "rejected" | "completed";
  note?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<QueueItem["status"], { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "warning.main" },
  accepted:  { label: "Accepted",  color: "success.main" },
  rejected:  { label: "Rejected",  color: "error.main"   },
  completed: { label: "Completed", color: "text.secondary" },
};

const QueueRow = ({
  item,
  onStatusChange,
}: {
  item: QueueItem;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) => {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);
  const cfg = STATUS_CONFIG[item.status];

  const act = async (status: string) => {
    setBusy(true);
    await onStatusChange(item.id, status);
    setBusy(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        px: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
      }}
    >
      <Avatar
        src={item.user.profilePictureUrl ?? undefined}
        sx={{ width: 38, height: 38, fontSize: 15, flexShrink: 0 }}
      >
        {item.user.displayName[0]}
      </Avatar>

      <Box flex={1} minWidth={0}>
        <Typography variant="body2" fontWeight={700} noWrap>{item.user.displayName}</Typography>
        <Typography variant="caption" color="text.secondary">@{item.user.username}</Typography>
      </Box>

      <Typography variant="caption" fontWeight={700} color={cfg.color} sx={{ flexShrink: 0 }}>
        {cfg.label}
      </Typography>

      {busy ? (
        <CircularProgress size={18} />
      ) : (
        <Stack direction="row" spacing={0.5} flexShrink={0}>
          {item.status === "pending" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => act("accepted")}
                sx={{ minWidth: 0, px: 1.2, py: 0.4, textTransform: "none", fontWeight: 700, fontSize: 12 }}
                startIcon={<IconCheck size={13} />}
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => act("rejected")}
                sx={{ minWidth: 0, px: 1.2, py: 0.4, textTransform: "none", fontWeight: 700, fontSize: 12 }}
                startIcon={<IconX size={13} />}
              >
                Reject
              </Button>
            </>
          )}
          {item.status === "accepted" && (
            <Button
              size="small"
              variant="contained"
              onClick={() => act("completed")}
              sx={{ minWidth: 0, px: 1.5, py: 0.4, textTransform: "none", fontWeight: 700, fontSize: 12 }}
              startIcon={<IconCheck size={13} />}
            >
              Complete
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};

const CommissionOpenDetailPageContent = ({ id }: { id: string }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [booking,  setBooking]  = useState(false);
  const [booked,   setBooked]   = useState(false);
  const [bookErr,  setBookErr]  = useState<string | null>(null);
  const [closing,  setClosing]  = useState(false);

  const { data, isLoading, mutate } = useSWR(`/api/commission/open/${id}`, getFetcher, { revalidateOnFocus: false });
  const item: CommissionOpenSlot | undefined = data?.data;

  const isOwn = !!user && !!item && user.username === item.artist.username;

  const { data: queueData, mutate: mutateQueue } = useSWR(
    isOwn ? `/api/commission/open/${id}/queue` : null,
    getFetcher,
    { revalidateOnFocus: false },
  );
  const queue: QueueItem[] = queueData?.data ?? [];

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

  const handleClose = async () => {
    if (closing) return;
    setClosing(true);
    try {
      await patchFetcher(`/api/commission/open/${id}/close`, {});
      mutate();
    } finally {
      setClosing(false);
    }
  };

  const handleStatusChange = async (queueItemId: string, status: string) => {
    await patchFetcher(`/api/commission/queue/${queueItemId}`, { status });
    mutateQueue();
    mutate();
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

  const slotsLeft = item.maxSlots - item.currentSlots;
  const slotPct   = item.maxSlots > 0 ? (item.currentSlots / item.maxSlots) * 100 : 0;
  const isFull    = slotsLeft <= 0 || item.status === "closed";

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Button
        startIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        sx={{ textTransform: "none", mb: 3, color: "text.secondary" }}
      >
        Back
      </Button>

      {/* ── Main slot card ── */}
      <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>

        {/* Status bar */}
        <Box sx={{
          px: 3, py: 1.75,
          bgcolor: item.status === "open" ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <BaseChip preset={item.status === "open" ? "open" : "close"} sx={{ fontWeight: 700, textTransform: "capitalize" }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption" color="text.secondary">
              {new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </Typography>
            {isOwn && item.status === "open" && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleClose}
                disabled={closing}
                sx={{ textTransform: "none", fontWeight: 700, py: 0.3, px: 1.5, fontSize: 12, borderRadius: 2 }}
              >
                {closing ? "Closing..." : "Close Slot"}
              </Button>
            )}
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={800} mb={0.5}>{item.title}</Typography>
          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 2.5 }}>
              {item.description}
            </Typography>
          )}

          <Divider sx={{ mb: 2.5 }} />

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

          {/* Book button (non-owner) */}
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

      {/* ── Queue management (owner only) ── */}
      {isOwn && (
        <Box mt={4}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={800}>Queue</Typography>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <IconClock size={15} style={{ opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {queue.length} request{queue.length !== 1 ? "s" : ""}
              </Typography>
            </Stack>
          </Stack>

          {!queueData ? (
            <Stack spacing={1}>
              {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={62} sx={{ borderRadius: 2 }} />)}
            </Stack>
          ) : queue.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary", border: `1px dashed ${theme.palette.divider}`, borderRadius: 3 }}>
              <IconUsers size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <Typography variant="body2">No bookings yet</Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {queue.map((q) => (
                <QueueRow key={q.id} item={q} onStatusChange={handleStatusChange} />
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Container>
  );
};

export default CommissionOpenDetailPageContent;
