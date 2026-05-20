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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type ArtistOption = ArtistMaster;


const MOCK_ITEMS: AdoptableListItem[] = [
  { id: "mock-1", number: 1, imageUrl: "https://picsum.photos/seed/wf1/400/500", artist: { username: "sakura_draw", displayName: "ã•ãã‚‰ âœ¿", profilePictureUrl: null }, owner: { username: "sakura_draw", displayName: "ã•ãã‚‰ âœ¿", profilePictureUrl: null }, status: "open", price: 250, createdAt: "2026-04-01T00:00:00.000Z", tags: [{ name: "Neko", color: "#FFB3C1", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-2", number: 2, imageUrl: "https://picsum.photos/seed/wf2/400/500", artist: { username: "moonlight_art", displayName: "Moonlight ðŸŒ™", profilePictureUrl: null }, owner: { username: "moonlight_art", displayName: "Moonlight ðŸŒ™", profilePictureUrl: null }, status: "close", price: 180, createdAt: "2026-04-02T00:00:00.000Z", tags: [{ name: "Fox", color: "#FFD580", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-3", number: 3, imageUrl: "https://picsum.photos/seed/wf3/400/500", artist: { username: "yuki_creates", displayName: "Yuki â„ï¸", profilePictureUrl: null }, owner: { username: "yuki_creates", displayName: "Yuki â„ï¸", profilePictureUrl: null }, status: "open", price: 320, createdAt: "2026-04-03T00:00:00.000Z", tags: [{ name: "Dragon", color: "#80D4FF", category: { name: "Species", color: "#FF6B6B" } }, { name: "Magic", color: "#D4A0FF", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-4", number: 4, imageUrl: "https://picsum.photos/seed/wf4/400/500", artist: { username: "hoshi_art", displayName: "ã»ã— â˜…", profilePictureUrl: null }, owner: { username: "hoshi_art", displayName: "ã»ã— â˜…", profilePictureUrl: null }, status: "resell", price: 150, createdAt: "2026-04-04T00:00:00.000Z", tags: [{ name: "Bunny", color: "#D4A0FF", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-5", number: 5, imageUrl: "https://picsum.photos/seed/wf5/400/500", artist: { username: "rayne_draws", displayName: "Rayne ðŸŒ§ï¸", profilePictureUrl: null }, owner: { username: "rayne_draws", displayName: "Rayne ðŸŒ§ï¸", profilePictureUrl: null }, status: "open", price: 500, createdAt: "2026-04-05T00:00:00.000Z", tags: [{ name: "Wolf", color: "#A0C4FF", category: { name: "Species", color: "#FF6B6B" } }, { name: "Dark", color: "#555", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-6", number: 6, imageUrl: "https://picsum.photos/seed/wf6/400/500", artist: { username: "tora_studio", displayName: "Tiger Studio ðŸ¯", profilePictureUrl: null }, owner: { username: "tora_studio", displayName: "Tiger Studio ðŸ¯", profilePictureUrl: null }, status: "open", price: 280, createdAt: "2026-04-06T00:00:00.000Z", tags: [{ name: "Tiger", color: "#FFB347", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-7", number: 7, imageUrl: "https://picsum.photos/seed/wf7/400/500", artist: { username: "niji_colors", displayName: "ã«ã˜ ðŸŒˆ", profilePictureUrl: null }, owner: { username: "niji_colors", displayName: "ã«ã˜ ðŸŒˆ", profilePictureUrl: null }, status: "close", price: 420, createdAt: "2026-04-07T00:00:00.000Z", tags: [{ name: "Fairy", color: "#FF9ECD", category: { name: "Species", color: "#FF6B6B" } }, { name: "Glitter", color: "#FFFACD", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-8", number: 8, imageUrl: "https://picsum.photos/seed/wf8/400/500", artist: { username: "stellar_art", displayName: "Stellar âœ¨", profilePictureUrl: null }, owner: { username: "stellar_art", displayName: "Stellar âœ¨", profilePictureUrl: null }, status: "open", price: 200, createdAt: "2026-04-08T00:00:00.000Z", tags: [{ name: "Demon", color: "#FF6060", category: { name: "Species", color: "#FF6B6B" } }], isNsfw: true },
  { id: "mock-9", number: 9, imageUrl: "https://picsum.photos/seed/wf9/400/500", artist: { username: "aqua_sketch", displayName: "Aqua ðŸ’§", profilePictureUrl: null }, owner: { username: "aqua_sketch", displayName: "Aqua ðŸ’§", profilePictureUrl: null }, status: "resell", price: 360, createdAt: "2026-04-09T00:00:00.000Z", tags: [{ name: "Merfolk", color: "#40E0D0", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-10", number: 10, imageUrl: "https://picsum.photos/seed/wf10/400/500", artist: { username: "ember_arts", displayName: "Ember ðŸ”¥", profilePictureUrl: null }, owner: { username: "ember_arts", displayName: "Ember ðŸ”¥", profilePictureUrl: null }, status: "open", price: 600, createdAt: "2026-04-10T00:00:00.000Z", tags: [{ name: "Phoenix", color: "#FF8C00", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-11", number: 11, imageUrl: "https://picsum.photos/seed/wf11/400/500", artist: { username: "crystal_draw", displayName: "Crystal ðŸ’Ž", profilePictureUrl: null }, owner: { username: "crystal_draw", displayName: "Crystal ðŸ’Ž", profilePictureUrl: null }, status: "open", price: 380, createdAt: "2026-04-11T00:00:00.000Z", tags: [{ name: "Elf", color: "#B0FFB0", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-12", number: 12, imageUrl: "https://picsum.photos/seed/wf12/400/500", artist: { username: "vivi_lineart", displayName: "Vivi ðŸŒ¸", profilePictureUrl: null }, owner: { username: "vivi_lineart", displayName: "Vivi ðŸŒ¸", profilePictureUrl: null }, status: "close", price: 240, createdAt: "2026-04-12T00:00:00.000Z", tags: [{ name: "Angel", color: "#FFFACD", category: { name: "Species", color: "#FF6B6B" } }], isNsfw: true },
  { id: "mock-13", number: 13, imageUrl: "https://picsum.photos/seed/wf13/400/500", artist: { username: "parareem_preme", displayName: "à¸žà¸£à¸µà¸¡ â˜†å½¡", profilePictureUrl: "https://cdn.discordapp.com/avatars/272227350895394816/6f8335e9940c524a316357f2d73d119f.png" }, owner: { username: "parareem_preme", displayName: "à¸žà¸£à¸µà¸¡ â˜†å½¡", profilePictureUrl: null }, status: "open", price: 450, createdAt: "2026-04-13T00:00:00.000Z", tags: [{ name: "Kitsune", color: "#40F0E8", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-14", number: 14, imageUrl: "https://picsum.photos/seed/wf14/400/500", artist: { username: "haruki_sketch", displayName: "Haruki ðŸƒ", profilePictureUrl: null }, owner: { username: "haruki_sketch", displayName: "Haruki ðŸƒ", profilePictureUrl: null }, status: "resell", price: 120, createdAt: "2026-04-14T00:00:00.000Z", tags: [{ name: "Plant", color: "#90EE90", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-15", number: 15, imageUrl: "https://picsum.photos/seed/wf15/400/500", artist: { username: "nova_arts", displayName: "Nova ðŸŒŸ", profilePictureUrl: null }, owner: { username: "nova_arts", displayName: "Nova ðŸŒŸ", profilePictureUrl: null }, status: "open", price: 750, createdAt: "2026-04-15T00:00:00.000Z", tags: [{ name: "Cosmic", color: "#7B68EE", category: { name: "Species", color: "#FF6B6B" } }, { name: "Rare", color: "#FFD700", category: { name: "Trait", color: "#9B59B6" } }] },
];



const AdoptablesPageContent = () => {
  const { artists } = useMasterData();
  const [items, setItems] = useState<AdoptableListItem[]>(MOCK_ITEMS);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [nsfwFilter, setNsfwFilter] = useState<"sfw" | "nsfw" | "all">("sfw");
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
          const data: AdoptableListItem[] = (json?.data ?? json)?.map?.((item: any) => ({
            ...item,
            isNsfw: typeof item.isNSFW !== "undefined" ? item.isNSFW : item.isNsfw,
          }));
          if (Array.isArray(data) && data.length > 0) {
            setItems([...data, ...MOCK_ITEMS]);
            return;
          }
        }
      } catch { /* use mock */ }
      setItems(MOCK_ITEMS);
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
      if (nsfwFilter === "sfw" && item.isNsfw) return false;
      if (nsfwFilter === "nsfw" && !item.isNsfw) return false;
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

  const activeFilterCount = statusFilter.length + categoryFilter.length + tagFilter.length + (nsfwFilter !== "sfw" ? 1 : 0) + (artistFilter ? 1 : 0);

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
        {/* â”€â”€ Filter Panel â”€â”€ */}
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

            {/* SFW/NSFW */}
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Content
            </Typography>
            <ToggleButtonGroup
              value={nsfwFilter}
              exclusive
              onChange={(_, v) => v && setNsfwFilter(v)}
              size="small"
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value="sfw" sx={{ textTransform: "none", fontWeight: 600 }}>
                SFW
              </ToggleButton>
              <ToggleButton value="all" sx={{ textTransform: "none", fontWeight: 600 }}>
                All
              </ToggleButton>
              <ToggleButton value="nsfw" sx={{ textTransform: "none", fontWeight: 600 }}>
                NSFW
              </ToggleButton>
            </ToggleButtonGroup>

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
                  <AdoptableCard item={item} sfw={nsfwFilter === "sfw"} sx={{ height: "100%" }} />
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
