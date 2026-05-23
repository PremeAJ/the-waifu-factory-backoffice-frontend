"use client";
import React, { useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconBell, IconBellOff, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";

interface NotificationActor {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

interface Notification {
  id: string;
  type: "new_follower" | "like_adoptable" | "like_commission" | "new_adoptable";
  actor: NotificationActor;
  targetId: string | null;
  isRead: boolean;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  new_follower: "followed you",
  like_adoptable: "liked your adoptable",
  like_commission: "liked your commission",
  new_adoptable: "posted a new adoptable",
};

function getTargetUrl(n: Notification): string | null {
  switch (n.type) {
    case "new_follower":
      return n.actor ? `/profile/${n.actor.username}` : null;
    case "like_adoptable":
    case "new_adoptable":
      return n.targetId ? `/adoptable/${n.targetId}` : null;
    case "like_commission":
      return n.targetId ? `/commission/${n.targetId}` : null;
    default:
      return null;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const NotificationBell = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  const { data: countData, mutate: mutateCount } = useSWR(
    user ? ["/api/notification/unread-count"] : null,
    ([url]) => getFetcher(url),
    { refreshInterval: 30000 }
  );
  const unread: number = countData?.count ?? countData?.data?.count ?? 0;

  const getKey = (pageIndex: number, prev: any) => {
    if (!open) return null;
    if (pageIndex > 0 && !prev) return null;
    if (prev && !prev.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 15 };
    if (pageIndex > 0 && prev?.meta?.nextCursor) params.cursor = prev.meta.nextCursor;
    return ["/api/notification", params];
  };

  const { data, size, setSize, isValidating, mutate: mutateList } = useSWRInfinite(
    getKey,
    getFetcher,
    { revalidateOnFocus: false }
  );

  const pages = data ?? [];
  const notifications: Notification[] = pages.flatMap((p) => p?.data ?? []);
  const hasMore = pages[pages.length - 1]?.meta?.hasMore ?? false;
  const isLoading = !data && isValidating;

  const refresh = () => {
    mutateCount();
    mutateList();
  };

  const markOne = async (id: string) => {
    await patchFetcher(`/api/notification/${id}/read`, {});
    refresh();
  };

  const markAll = async () => {
    await patchFetcher("/api/notification/read-all", {});
    refresh();
  };

  const handleClick = async (n: Notification) => {
    if (!n.isRead) await markOne(n.id);
    const url = getTargetUrl(n);
    if (url) router.push(url);
    setAnchor(null);
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: "text.secondary" }}
      >
        <Badge badgeContent={unread > 0 ? unread : undefined} color="error" max={99}>
          <IconBell size={20} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 520, display: "flex", flexDirection: "column", mt: 0.5 } } }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
          <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
          {unread > 0 && (
            <Button
              size="small"
              startIcon={<IconCheck size={14} />}
              onClick={markAll}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Mark all read
            </Button>
          )}
        </Stack>
        <Divider />

        {/* List */}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <IconBellOff size={36} stroke={1.2} style={{ opacity: 0.4 }} />
              <Typography variant="body2" mt={1}>No notifications yet</Typography>
            </Box>
          ) : (
            <>
              {notifications.map((n) => (
                <Stack
                  key={n.id}
                  direction="row"
                  gap={1.5}
                  onClick={() => handleClick(n)}
                  sx={{
                    px: 2,
                    py: 1.25,
                    cursor: "pointer",
                    bgcolor: n.isRead ? "transparent" : alpha(theme.palette.primary.main, 0.06),
                    borderLeft: n.isRead ? "3px solid transparent" : `3px solid ${theme.palette.primary.main}`,
                    "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                    transition: "background 0.15s",
                  }}
                >
                  <Avatar
                    src={n.actor?.profilePictureUrl ?? undefined}
                    sx={{ width: 38, height: 38, flexShrink: 0, mt: 0.25 }}
                  >
                    {n.actor?.displayName[0] ?? "?"}
                  </Avatar>
                  <Box minWidth={0} flex={1}>
                    <Typography variant="body2" lineHeight={1.4}>
                      <Box component="span" fontWeight={700}>{n.actor?.displayName ?? "Someone"}</Box>
                      {" "}{TYPE_LABEL[n.type] ?? n.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{timeAgo(n.createdAt)}</Typography>
                  </Box>
                  {!n.isRead && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0, mt: 1.5 }} />
                  )}
                </Stack>
              ))}
              {hasMore && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
                  <Button
                    size="small"
                    onClick={() => setSize(size + 1)}
                    disabled={isValidating}
                    sx={{ textTransform: "none", fontSize: 12 }}
                  >
                    {isValidating ? "Loading..." : "Load more"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;
