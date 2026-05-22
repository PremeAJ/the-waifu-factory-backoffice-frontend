"use client";

import { CookiesKey } from "@/common/constants/cookies";
import { getFetcher } from "@/app/api/globalFetcher";
import { useArtists, useAdoptableTags, usePaymentMethods, ArtistMaster } from "@/common/hooks/useMasterData";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdoptableCard, { AdoptableListItem } from "./AdoptableCard";
import AdoptableFilterPanel from "./AdoptableFilterPanel";
import AdoptableSortBar, { SortByOption } from "./AdoptableSortBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWRInfinite from "swr/infinite";

const AdoptablesPageContent = () => {
  const { artists } = useArtists();
  const { adoptableTags } = useAdoptableTags();
  const { paymentMethods } = usePaymentMethods();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Filter state (initialized from URL) ──
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState<string[]>(() => searchParams.getAll("status"));
  const [categoryFilter, setCategoryFilter] = useState<string[]>(() => searchParams.getAll("category"));
  const [tagFilter, setTagFilter] = useState<string[]>(() => searchParams.getAll("tags"));
  const [nsfwFilter, setNsfwFilter] = useState<"sfw" | "nsfw" | "all">(
    () => (searchParams.get("content") as "sfw" | "nsfw" | "all") ?? "all"
  );
  const [artistFilter, setArtistFilter] = useState<ArtistMaster | null>(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string[]>(() => searchParams.getAll("paymentMethod"));
  const [showNsfw, setShowNsfw] = useState(false);
  const [sortBy, setSortBy] = useState<SortByOption>(
    () => (searchParams.get("sort") as SortByOption) ?? "createdAt_desc"
  );

  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  // Resolve artist from URL once master data loads
  const artistInitialized = useRef(false);
  useEffect(() => {
    const username = searchParams.get("artist");
    if (!artistInitialized.current && username && artists.length > 0) {
      artistInitialized.current = true;
      const found = artists.find((a) => a.username === username);
      if (found) setArtistFilter(found);
    }
  }, [artists]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Sync filter state → URL (shareable link)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (artistFilter) params.set("artist", artistFilter.username);
    if (nsfwFilter !== "all") params.set("content", nsfwFilter);
    statusFilter.forEach((s) => params.append("status", s));
    categoryFilter.forEach((c) => params.append("categories", c));
    tagFilter.forEach((t) => params.append("tags", t));
    paymentMethodFilter.forEach((p) => params.append("paymentMethod", p));
    if (sortBy !== "createdAt_desc") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, artistFilter, nsfwFilter, statusFilter, categoryFilter, tagFilter, paymentMethodFilter, sortBy]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (artistFilter) params.artist = artistFilter.username;
    if (nsfwFilter !== "all") params.content = nsfwFilter;
    if (statusFilter.length > 0) params.status = statusFilter;
    if (categoryFilter.length > 0) params.categories = categoryFilter;
    if (tagFilter.length > 0) params.tags = tagFilter;
    if (paymentMethodFilter.length > 0) params.paymentMethod = paymentMethodFilter;
    if (sortBy !== "createdAt_desc") params.sort = sortBy;
    return params;
  }, [debouncedSearch, artistFilter, nsfwFilter, statusFilter, categoryFilter, tagFilter, paymentMethodFilter, sortBy]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = {
      ...queryParams,
      limit: 20,
    };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) {
      params.cursor = previousPageData.meta.nextCursor;
    }
    return ["/api/adoptable", params];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    setSize(1);
  }, [queryParams, setSize]);

  const pages = data ?? [];
  const items: AdoptableListItem[] = pages.flatMap((page) => page?.data ?? []);
  const meta = pages[pages.length - 1]?.meta;
  const isLoading = !data && !error;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const hasMore = meta?.hasMore ?? false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setSize((prev) => prev + 1);
    }
  }, [hasMore, isLoadingMore, setSize]);

  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  const allArtists = useMemo(
    () => [...artists].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [artists]
  );

  // Tags visible in panel: all categories, or only those matching categoryFilter
  const visibleTagCategories = useMemo(() => {
    if (categoryFilter.length === 0) return adoptableTags;
    return adoptableTags.filter((cat) => categoryFilter.includes(cat.name));
  }, [adoptableTags, categoryFilter]);

  const activeFilterCount =
    statusFilter.length +
    categoryFilter.length +
    tagFilter.length +
    paymentMethodFilter.length +
    (["sfw", "nsfw"].includes(nsfwFilter) ? 1 : 0) +
    (artistFilter ? 1 : 0);

  const clearAll = () => {
    setArtistFilter(null);
    setCategoryFilter([]);
    setNsfwFilter("all");
    setSearch("");
    setStatusFilter([]);
    setTagFilter([]);
    setPaymentMethodFilter([]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Grid container spacing={3}>
        {/* ── Filter Panel ── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <AdoptableFilterPanel
            activeFilterCount={activeFilterCount}
            adoptableTags={adoptableTags}
            allArtists={allArtists}
            artistFilter={artistFilter}
            categoryFilter={categoryFilter}
            nsfwFilter={nsfwFilter}
            onArtistFilterChange={setArtistFilter}
            onCategoryFilterChange={setCategoryFilter}
            onClearAll={clearAll}
            onNsfwFilterChange={setNsfwFilter}
            onSearchChange={setSearch}
            onShowNsfwChange={setShowNsfw}
            onStatusFilterChange={setStatusFilter}
            onTagFilterChange={setTagFilter}
            paymentMethodFilter={paymentMethodFilter}
            onPaymentMethodFilterChange={setPaymentMethodFilter}
            allPaymentMethods={paymentMethods}
            search={search}
            showNsfw={showNsfw}
            statusFilter={statusFilter}
            tagFilter={tagFilter}
            visibleTagCategories={visibleTagCategories}
          />
        </Grid>

        {/* â”€â”€ Card Grid â”€â”€ */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Sort bar */}
          <AdoptableSortBar sortBy={sortBy} onSortChange={setSortBy} />
          {isLoading ? (
            <Grid container spacing={2.5}>
              {Array.from({ length: 12 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "120%" }} />
                    <Box sx={{ p: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.8} mb={0.8}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width="60%" height={16} />
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <Skeleton variant="rounded" width={48} height={20} />
                        <Skeleton variant="rounded" width={48} height={20} />
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : items.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 12,
                color: "text.secondary",
              }}
            >
              <Typography variant="h5" fontWeight={600} mb={1}>
                ไม่พบ adoptable ที่ตรงกับ filter
              </Typography>
              <Button onClick={clearAll} variant="outlined" sx={{ mt: 2, borderRadius: 3, textTransform: "none" }}>
                Clear filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2.5}>
                {items.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <AdoptableCard
                      item={item}
                      sx={{ height: "100%" }}
                      sfw={!showNsfw}
                    />
                  </Grid>
                ))}
              </Grid>
              {hasMore && <Box ref={loadMoreRef} sx={{ height: 1, width: "100%" }} />}
              {hasMore && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() => setSize(size + 1)}
                    disabled={isLoadingMore}
                    sx={{ textTransform: "none", borderRadius: 3, px: 4 }}
                  >
                    {isLoadingMore ? "Loading more..." : "Load more"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdoptablesPageContent;