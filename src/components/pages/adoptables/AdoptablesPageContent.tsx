"use client";

import { getFetcher } from "@/app/api/globalFetcher";
import { useArtists, useAdoptableTags, ArtistMaster } from "@/common/hooks/useMasterData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdoptableCard, { AdoptableListItem } from "./AdoptableCard";
import AdoptableFilterPanel from "./AdoptableFilterPanel";
import AdoptableSortBar, { SortByOption } from "./AdoptableSortBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const AdoptablesPageContent = () => {
  const { artists } = useArtists();
  const { adoptableTags } = useAdoptableTags();
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
  const [sortBy, setSortBy] = useState<SortByOption>(
    () => (searchParams.get("sort") as SortByOption) ?? "createdAt_desc"
  );

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
    categoryFilter.forEach((c) => params.append("category", c));
    tagFilter.forEach((t) => params.append("tags", t));
    if (sortBy !== "createdAt_desc") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, artistFilter, nsfwFilter, statusFilter, categoryFilter, tagFilter, sortBy]);

  // Build query params → SWR key
  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (artistFilter) params.set("artist", artistFilter.username);
    if (nsfwFilter !== "all") params.set("content", nsfwFilter);
    statusFilter.forEach((s) => params.append("status", s));
    categoryFilter.forEach((c) => params.append("category", c));
    tagFilter.forEach((t) => params.append("tags", t));
    params.set("sort", sortBy);
    const qs = params.toString();
    return `/api/adoptable${qs ? `?${qs}` : ""}`;
  }, [debouncedSearch, artistFilter, nsfwFilter, statusFilter, categoryFilter, tagFilter, sortBy]);

  const { data, isLoading } = useSWR(swrKey, getFetcher);
  const items: AdoptableListItem[] = data?.data ?? [];

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
    (["sfw", "nsfw"].includes(nsfwFilter) ? 1 : 0) +
    (artistFilter ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setStatusFilter([]);
    setCategoryFilter([]);
    setTagFilter([]);
    setNsfwFilter("sfw");
    setArtistFilter(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h2" fontWeight={800}>
            Adoptables
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            {isLoading ? "Loading..." : `${items.length} adoptable${items.length !== 1 ? "s" : ""} found`}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Filter Panel ── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <AdoptableFilterPanel
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            nsfwFilter={nsfwFilter}
            onNsfwFilterChange={setNsfwFilter}
            artistFilter={artistFilter}
            onArtistFilterChange={setArtistFilter}
            activeFilterCount={activeFilterCount}
            onClearAll={clearAll}
            allArtists={allArtists}
            adoptableTags={adoptableTags}
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
            <Grid container spacing={2.5}>
              {items.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AdoptableCard
                    item={item}
                    sx={{ height: "100%" }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdoptablesPageContent;