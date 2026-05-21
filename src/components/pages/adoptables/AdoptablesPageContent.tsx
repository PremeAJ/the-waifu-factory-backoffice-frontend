"use client";
import { BaseCard, BaseChip } from "@/common/components/base";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import { getFetcher } from "@/app/api/globalFetcher";
import { IconArrowsSort, IconSearch, IconX } from "@tabler/icons-react";
import { useArtists, useAdoptableTags, ArtistMaster } from "@/common/hooks/useMasterData";
import AdoptableCard, { AdoptableListItem, AdoptableTag } from "./AdoptableCard";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Cookies from "js-cookie";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


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
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price_asc" | "price_desc">(
    () => (searchParams.get("sort") as "newest" | "oldest" | "price_asc" | "price_desc") ?? "newest"
  );
  // Dummy state to force re-render on NSFW blur toggle
  const [dummy, setDummy] = useState(0);
  const showNsfw = typeof window !== "undefined" ? Cookies.get(CookiesKey.NSFW_MODE) === "true" : false;

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
    if (sortBy !== "newest") params.set("sort", sortBy);
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

  const toggleChip = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
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
          <BaseCard
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 1,
              position: { md: "sticky" },
              top: 80,
            }}
          >
          
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Typography>
              {activeFilterCount > 0 && (
                <Button
                  size="small"
                  onClick={clearAll}
                  startIcon={<IconX size={14} />}
                  sx={{ textTransform: "none", fontSize: 12 }}
                >
                  Clear all
                </Button>
              )}
            </Stack>

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={16} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            {/* Artist autocomplete */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Artist
            </Typography>
            <Autocomplete
              options={allArtists}
              value={artistFilter}
              onChange={(_, v) => setArtistFilter(v)}
              getOptionLabel={(o) => o.displayName}
              isOptionEqualToValue={(a, b) => a.username === b.username}
              size="small"
              renderOption={({ key, ...props }, option) => (
                <Box key={key} component="li" {...props} sx={{ gap: 1 }}>
                  <Avatar
                    src={option.profilePictureUrl ?? undefined}
                    sx={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}
                  >
                    {option.displayName[0]}
                  </Avatar>
                  <Typography variant="body2" noWrap>{option.displayName}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search artist..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              )}
              sx={{ mb: 3 }}
            />

              {/* Content filter (SFW/ALL/NSFW) */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Content
            </Typography>
            <ToggleButtonGroup
              value={nsfwFilter}
              exclusive
              onChange={(_, v) => v && setNsfwFilter(v)}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="sfw" sx={{ textTransform: "none", fontWeight: 600 }}>
                SFW
              </ToggleButton>
              <ToggleButton value="all" sx={{ textTransform: "none", fontWeight: 600 }}>
                All
              </ToggleButton>
              <ToggleButton value="nsfw" sx={{ textTransform: "none", fontWeight: 600 }}>
                🔞NSFW
              </ToggleButton>
            </ToggleButtonGroup>
            {/* See NSFW content toggle */}
            <Box mb={3}>
              <SeeNSFWContentToggle
                value={showNsfw}
                onChange={(checked) => {
                  Cookies.set(CookiesKey.NSFW_MODE, String(checked), setCookiesOption1Y);
                  setDummy((d) => d + 1); // force re-render
                }}
              />
            </Box>

            {/* Status */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Status
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
              {(["open", "resell", "close"] as const).map((s) => (
                <BaseChip
                  key={s}
                  preset={s}
                  variant={statusFilter.includes(s) ? "filled" : "outlined"}
                  onClick={() => toggleChip(statusFilter, setStatusFilter, s)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>


            {/* Categories */}
            {adoptableTags.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Category
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
                  {adoptableTags.map((cat) => {
                    const active = categoryFilter.includes(cat.name);
                    return (
                      <BaseChip
                        key={cat.id}
                        label={cat.name}
                        onClick={() => toggleChip(categoryFilter, setCategoryFilter, cat.name)}
                        variant={active ? "filled" : "outlined"}
                        sx={{ cursor: "pointer", fontWeight: 600, ...(active && { bgcolor: "primary.main", color: "primary.contrastText" }) }}
                      />
                    );
                  })}
                </Box>
              </>
            )}

            {/* Tags */}
            {visibleTagCategories.some((c) => c.tags.length > 0) && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {visibleTagCategories.flatMap((cat) =>
                    cat.tags.map((tag) => {
                      const active = tagFilter.includes(tag.name);
                      const color = tag.color ?? cat.color ?? "#888";
                      return (
                        <Tooltip key={tag.id} title={cat.name}>
                          <BaseChip
                            label={tag.name}
                            onClick={() => toggleChip(tagFilter, setTagFilter, tag.name)}
                            sx={{
                              cursor: "pointer",
                              bgcolor: active ? color : "transparent",
                              color: active ? "#fff" : "text.primary",
                              border: `1.5px solid ${color}`,
                              "&:hover": { bgcolor: color, color: "#fff" },
                            }}
                          />
                        </Tooltip>
                      );
                    })
                  )}
                </Box>
              </>
            )}
          </BaseCard>
        </Grid>

        {/* â”€â”€ Card Grid â”€â”€ */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Sort bar */}
          <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={2.5} gap={1}>
            <IconArrowsSort size={16} />
            <Typography variant="body2" color="text.secondary">Sort by</Typography>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              size="small"
              sx={{ minWidth: 160, borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 } }}
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
            </Select>
          </Stack>
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
