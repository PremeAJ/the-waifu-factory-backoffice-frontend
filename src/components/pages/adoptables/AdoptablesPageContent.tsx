"use client";
import React, { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconArrowsSort, IconSearch, IconX } from "@tabler/icons-react";
import { useMasterData, ArtistMaster } from "@/common/contexts/MasterDataContext";
import { BaseCard, BaseChip } from "@/common/components/base";
import AdoptableCard, { AdoptableListItem, AdoptableTag } from "./AdoptableCard";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";


const AdoptablesPageContent = () => {
  const { artists } = useMasterData();
  const [items, setItems] = useState<AdoptableListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [nsfwFilter, setNsfwFilter] = useState<"sfw" | "nsfw" | "all">("all");
  // Dummy state to force re-render on NSFW toggle
  const [dummy, setDummy] = useState(0);
  // Read NSFW blur preference from cookie (default true = blur)
  const showNsfw = typeof window !== "undefined" ? Cookies.get(CookiesKey.SFW_MODE) !== "false" : true;
  const [artistFilter, setArtistFilter] = useState<ArtistMaster | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price_asc" | "price_desc">("newest");

  useEffect(() => {
    const fetchAdoptables = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/adoptable`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (res.ok) {
          const json = await res.json();
          const data: AdoptableListItem[] = json?.data ?? json;
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
            return;
          }
        }
      } catch { /* API error */ }
      setIsLoading(false);
    };
    fetchAdoptables().finally(() => setIsLoading(false));
  }, []);

  // Derive unique artists from items (fallback when context returns nothing)
  const allArtists = useMemo(() => {
    if (artists.length > 0) return artists;
    const map = new Map<string, ArtistMaster>();
    items.forEach((i) => map.set(i.artist.username, { id: i.artist.username, ...i.artist }));
    return Array.from(map.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [items, artists]);

  // Derive unique categories & tags from items
  const allCategories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => s.add(t.category.name)));
    return Array.from(s).sort();
  }, [items]);

  const allTags = useMemo(() => {
    const map = new Map<string, AdoptableTag>();
    items.forEach((i) => i.tags.forEach((t) => map.set(t.name, t)));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // Filter tags shown in panel based on selected categories
  const visibleTags = useMemo(() => {
    if (categoryFilter.length === 0) return allTags;
    return allTags.filter((t) => categoryFilter.includes(t.category.name));
  }, [allTags, categoryFilter]);

  const filtered = useMemo(() => {
    const result = items.filter((item) => {
      if (search && !`#${item.number} ${item.artist.displayName} ${item.tags.map((t) => t.name).join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(item.status)) return false;
      if (categoryFilter.length > 0 && !item.tags.some((t) => categoryFilter.includes(t.category.name))) return false;
      if (tagFilter.length > 0 && !item.tags.some((t) => tagFilter.includes(t.name))) return false;
      if (nsfwFilter === "sfw" && item.isNSFW) return false;
      if (nsfwFilter === "nsfw" && !item.isNSFW) return false;
      if (artistFilter && item.artist.username !== artistFilter.username) return false;
      return true;
    });
    return result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "price_asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
      return 0;
    });
  }, [items, search, statusFilter, categoryFilter, tagFilter, nsfwFilter, artistFilter, sortBy]);

  const activeFilterCount = statusFilter.length + categoryFilter.length + tagFilter.length + (["sfw", "nsfw"].includes(nsfwFilter) ? 1 : 0) + (artistFilter ? 1 : 0);

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
            {isLoading ? "Loading..." : `${filtered.length} adoptable${filtered.length !== 1 ? "s" : ""} found`}
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
                  Cookies.set(CookiesKey.SFW_MODE, String(checked), setCookiesOption1Y);
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
            {allCategories.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Category
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
                  {allCategories.map((cat) => {
                    const active = categoryFilter.includes(cat);
                    return (
                      <BaseChip
                        key={cat}
                        label={cat}
                        onClick={() => toggleChip(categoryFilter, setCategoryFilter, cat)}
                        variant={active ? "filled" : "outlined"}
                        sx={{ cursor: "pointer", fontWeight: 600, ...(active && { bgcolor: "primary.main", color: "primary.contrastText" }) }}
                      />
                    );
                  })}
                </Box>
              </>
            )}

            {/* Tags */}
            {visibleTags.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {visibleTags.map((tag) => {
                    const active = tagFilter.includes(tag.name);
                    return (
                      <Tooltip key={tag.name} title={tag.category.name}>
                        <BaseChip
                          label={tag.name}
                          onClick={() => toggleChip(tagFilter, setTagFilter, tag.name)}
                          sx={{
                            cursor: "pointer",
                            bgcolor: active ? tag.color : "transparent",
                            color: active ? "#fff" : "text.primary",
                            border: `1.5px solid ${tag.color}`,
                            "&:hover": { bgcolor: tag.color, color: "#fff" },
                          }}
                        />
                      </Tooltip>
                    );
                  })}
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
          {filtered.length === 0 ? (
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
                 filter
              </Typography>
              <Button onClick={clearAll} variant="outlined" sx={{ mt: 2, borderRadius: 3, textTransform: "none" }}>
                Clear filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {filtered.map((item) => (
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
