"use client";
import React, { useCallback, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { getFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";
import CommissionCard from "@/components/pages/commission/CommissionCard";
import type { CommissionPost } from "@/components/pages/commission/types";
import { IconBrush } from "@tabler/icons-react";

type CommissionType = "all" | "created" | "owned";

const TYPE_LABELS: { value: CommissionType; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "created", label: "Created" },
  { value: "owned",   label: "Owned" },
];

const CommissionTab = ({ username }: { username: string }) => {
  const [type, setType] = useState<CommissionType>("all");

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20, type };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) params.cursor = previousPageData.meta.nextCursor;
    return [`/api/user/${username}/commission`, params];
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

  const handleTypeChange = (_: React.MouseEvent, value: CommissionType | null) => {
    if (value) { setType(value); setSize(1); }
  };

  if (isLoading) {
    return (
      <>
        <Box sx={{ mb: 2.5 }}><Skeleton variant="rounded" width={200} height={32} /></Box>
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 3, md: 2 }}>
              <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "100%" }} />
                <Box sx={{ p: 1.5 }}>
                  <Skeleton variant="text" width="80%" height={16} sx={{ mb: 0.5 }} />
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="50%" height={14} />
                  </Stack>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleTypeChange}
          size="small"
          sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 600, px: 2.5, borderRadius: "20px !important", border: "none", mx: 0.5 } }}
        >
          {TYPE_LABELS.map(({ value, label }) => (
            <ToggleButton key={value} value={value}>{label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
          <Box sx={{ opacity: 0.35 }}><IconBrush size={56} stroke={1.2} /></Box>
          <Typography variant="h6" mt={1.5} fontWeight={600}>No commissions yet</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 3, md: 2 }}>
                <CommissionCard item={item} sx={{ height: "100%" }} />
              </Grid>
            ))}
          </Grid>
          {hasMore && <Box ref={loadMoreRef} sx={{ height: 1, width: "100%" }} />}
          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button variant="contained" onClick={() => setSize(size + 1)} disabled={isValidating} sx={{ textTransform: "none", borderRadius: 3, px: 4 }}>
                {isValidating ? "Loading more..." : "Load more"}
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default CommissionTab;
