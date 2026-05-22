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
import AdoptableCard, { AdoptableListItem } from "@/components/pages/adoptables/AdoptableCard";
import { IconHeart } from "@tabler/icons-react";

type AdoptableType = "all" | "created" | "owned";

const TYPE_LABELS: { value: AdoptableType; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "created", label: "Created" },
  { value: "owned",   label: "Owned" },
];

const AdoptableTab = ({ username }: { username: string }) => {
  const [type, setType] = useState<AdoptableType>("all");

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20, type };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) {
      params.cursor = previousPageData.meta.nextCursor;
    }
    return [`/api/user/${username}/adoptable`, params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, {
    revalidateOnFocus: false,
  });

  const pages = data ?? [];
  const items: AdoptableListItem[] = pages.flatMap((p) => p?.data ?? []);
  const meta = pages[pages.length - 1]?.meta;
  const isLoading = !data && isValidating;
  const hasMore = meta?.hasMore ?? false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);

  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  const handleTypeChange = (_: React.MouseEvent, value: AdoptableType | null) => {
    if (value) {
      setType(value);
      setSize(1);
    }
  };

  const skeletonGrid = (
    <Grid container spacing={2}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 3, md: 2 }}>
          <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "120%" }} />
            <Box sx={{ p: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.8} mb={0.8}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={16} />
              </Stack>
              <Skeleton variant="rounded" width={48} height={20} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {/* Type filter */}
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

      {isLoading ? skeletonGrid : items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
          <Box sx={{ opacity: 0.35 }}><IconHeart size={56} stroke={1.2} /></Box>
          <Typography variant="h6" mt={1.5} fontWeight={600}>No adoptables yet</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 3, md: 2 }}>
                <AdoptableCard item={item} sx={{ height: "100%" }} />
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
      )}
    </>
  );
};

export default AdoptableTab;
