"use client";
import React, { useCallback, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { getFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";
import CommissionCard from "./CommissionCard";
import CommissionOpenCard from "./CommissionOpenCard";
import type { CommissionPost, CommissionOpenSlot } from "./types";
import { IconBrush, IconPlus, IconUsers } from "@tabler/icons-react";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";

type TabKey = "posts" | "open";

const PostsSkeleton = () => (
  <Grid container spacing={2.5}>
    {Array.from({ length: 12 }).map((_, i) => (
      <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
        <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "100%" }} />
          <Box sx={{ p: 1.5 }}>
            <Skeleton variant="text" width="80%" height={18} sx={{ mb: 0.5 }} />
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="50%" height={14} />
            </Stack>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

const OpenSkeleton = () => (
  <Grid container spacing={2.5}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
      </Grid>
    ))}
  </Grid>
);

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
  <Box sx={{ textAlign: "center", py: 14, color: "text.secondary" }}>
    <Box sx={{ opacity: 0.3, mb: 1.5 }}>{icon}</Box>
    <Typography variant="h6" fontWeight={600}>{title}</Typography>
    {subtitle && <Typography variant="body2" mt={0.5}>{subtitle}</Typography>}
  </Box>
);

// ── Posts tab ──────────────────────────────────────────────────────────────────

const PostsTab = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20 };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) params.cursor = previousPageData.meta.nextCursor;
    return ["/api/commission", params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, { revalidateOnFocus: false });
  const pages = data ?? [];
  const items: CommissionPost[] = pages.flatMap((p) => p?.data ?? []);
  const hasMore = pages[pages.length - 1]?.meta?.hasMore ?? false;
  const isLoading = !data && isValidating;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);
  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  if (isLoading) return <PostsSkeleton />;
  if (items.length === 0) return <EmptyState icon={<IconBrush size={56} stroke={1.2} />} title="No commission posts yet" subtitle="Artists will post their completed commissions here" />;

  return (
    <>
      <Grid container spacing={2.5}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <CommissionCard item={item} sx={{ height: "100%" }} />
          </Grid>
        ))}
      </Grid>
      {hasMore && <Box ref={loadMoreRef} sx={{ height: 1 }} />}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" onClick={() => setSize(size + 1)} disabled={isValidating} sx={{ textTransform: "none", borderRadius: 3, px: 4 }}>
            {isValidating ? "Loading more..." : "Load more"}
          </Button>
        </Box>
      )}
    </>
  );
};

// ── Open slots tab ─────────────────────────────────────────────────────────────

const OpenTab = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20 };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) params.cursor = previousPageData.meta.nextCursor;
    return ["/api/commission/open", params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, { revalidateOnFocus: false });
  const pages = data ?? [];
  const items: CommissionOpenSlot[] = pages.flatMap((p) => p?.data ?? []);
  const hasMore = pages[pages.length - 1]?.meta?.hasMore ?? false;
  const isLoading = !data && isValidating;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);
  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  if (isLoading) return <OpenSkeleton />;
  if (items.length === 0) return <EmptyState icon={<IconUsers size={56} stroke={1.2} />} title="No open commissions" subtitle="Check back later when artists open their slots" />;

  return (
    <>
      <Grid container spacing={2.5}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CommissionOpenCard item={item} sx={{ height: "100%" }} />
          </Grid>
        ))}
      </Grid>
      {hasMore && <Box ref={loadMoreRef} sx={{ height: 1 }} />}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" onClick={() => setSize(size + 1)} disabled={isValidating} sx={{ textTransform: "none", borderRadius: 3, px: 4 }}>
            {isValidating ? "Loading more..." : "Load more"}
          </Button>
        </Box>
      )}
    </>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────

const CommissionsPageContent = () => {
  const theme = useTheme();
  const [tab, setTab] = useState<TabKey>("posts");
  const { user } = useCurrentUser();

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Page header */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Commissions</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Browse artwork commissions and find artists to work with
          </Typography>
        </Box>
        {user && (
          <Stack direction="row" spacing={1.5} flexShrink={0}>
            <Button
              variant="outlined"
              startIcon={<IconPlus size={16} />}
              href="/commission/create"
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              Post Commission
            </Button>
            <Button
              variant="contained"
              startIcon={<IconPlus size={16} />}
              href="/commission/open/create"
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              Open Slot
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v: TabKey) => setTab(v)}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}
      >
        <Tab value="posts" label="Commission Posts" sx={{ textTransform: "none", fontWeight: 600 }} />
        <Tab value="open" label="Open Slots" sx={{ textTransform: "none", fontWeight: 600 }} />
      </Tabs>

      {tab === "posts" && <PostsTab />}
      {tab === "open"  && <OpenTab />}
    </Container>
  );
};

export default CommissionsPageContent;
