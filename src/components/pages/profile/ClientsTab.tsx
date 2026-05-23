"use client";
import React, { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { getFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";
import { IconUsers } from "@tabler/icons-react";

interface ClientUser {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  adoptableCount: number;
  commissionCount: number;
  totalCount: number;
}

const ClientsTab = ({ username }: { username: string }) => {
  const theme = useTheme();
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20 };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) {
      params.cursor = previousPageData.meta.nextCursor;
    }
    return [`/api/user/${username}/clients`, params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, {
    revalidateOnFocus: false,
  });

  const pages = data ?? [];
  const clients: ClientUser[] = pages.flatMap((p) => p?.data ?? []);
  const meta = pages[pages.length - 1]?.meta;
  const isLoading = !data && isValidating;
  const hasMore = meta?.hasMore ?? false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);

  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Skeleton variant="circular" width={44} height={44} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={18} />
                <Skeleton variant="text" width="40%" height={14} />
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (clients.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
        <Box sx={{ opacity: 0.35 }}><IconUsers size={56} stroke={1.2} /></Box>
        <Typography variant="h6" mt={1.5} fontWeight={600}>No clients yet</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {clients.map((c) => (
          <Grid key={c.username} size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              onClick={() => router.push(`/profile/${c.username}`)}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                cursor: "pointer",
                transition: "background 0.15s",
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
              }}
            >
              <Avatar src={c.profilePictureUrl ?? undefined} sx={{ width: 44, height: 44, flexShrink: 0 }}>
                {c.displayName[0]}
              </Avatar>
              <Box minWidth={0} flex={1}>
                <Typography fontWeight={600} variant="body2" noWrap>{c.displayName}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">@{c.username}</Typography>
                <Stack direction="row" gap={0.5} mt={0.5} flexWrap="wrap">
                  {c.adoptableCount > 0 && (
                    <Chip label={`${c.adoptableCount} adoptable`} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 600 }} />
                  )}
                  {c.commissionCount > 0 && (
                    <Chip label={`${c.commissionCount} commission`} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 600 }} />
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
      {hasMore && <Box ref={loadMoreRef} sx={{ height: 1, width: "100%" }} />}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            sx={{ textTransform: "none", borderRadius: 3, px: 4 }}
          >
            {isValidating ? "Loading more..." : "Load more"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ClientsTab;
