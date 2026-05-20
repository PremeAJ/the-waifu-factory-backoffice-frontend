"use client";
import React, { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
import { alpha, useTheme } from "@mui/material/styles";
import { IconArrowsSort, IconExternalLink, IconSearch, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useMasterData, ArtistMaster } from "@/common/contexts/MasterDataContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdoptableUser {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

type ArtistOption = ArtistMaster;

interface AdoptableTag {
  name: string;
  color: string;
  category: { name: string; color: string };
}

export interface AdoptableListItem {
  id: string;
  number: number;
  imageUrl: string;
  externalUrl?: string;
  artist: AdoptableUser;
  owner: AdoptableUser;
  status: "open" | "close" | "resell";
  price?: number;
  createdAt: string;
  tags: AdoptableTag[];
  isNsfw?: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ITEMS: AdoptableListItem[] = [
  { id: "mock-1", number: 1, imageUrl: "https://picsum.photos/seed/wf1/400/500", artist: { username: "sakura_draw", displayName: "さくら ✿", profilePictureUrl: null }, owner: { username: "sakura_draw", displayName: "さくら ✿", profilePictureUrl: null }, status: "open", price: 250, createdAt: "2026-04-01T00:00:00.000Z", tags: [{ name: "Neko", color: "#FFB3C1", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-2", number: 2, imageUrl: "https://picsum.photos/seed/wf2/400/500", artist: { username: "moonlight_art", displayName: "Moonlight 🌙", profilePictureUrl: null }, owner: { username: "moonlight_art", displayName: "Moonlight 🌙", profilePictureUrl: null }, status: "close", price: 180, createdAt: "2026-04-02T00:00:00.000Z", tags: [{ name: "Fox", color: "#FFD580", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-3", number: 3, imageUrl: "https://picsum.photos/seed/wf3/400/500", artist: { username: "yuki_creates", displayName: "Yuki ❄️", profilePictureUrl: null }, owner: { username: "yuki_creates", displayName: "Yuki ❄️", profilePictureUrl: null }, status: "open", price: 320, createdAt: "2026-04-03T00:00:00.000Z", tags: [{ name: "Dragon", color: "#80D4FF", category: { name: "Species", color: "#FF6B6B" } }, { name: "Magic", color: "#D4A0FF", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-4", number: 4, imageUrl: "https://picsum.photos/seed/wf4/400/500", artist: { username: "hoshi_art", displayName: "ほし ★", profilePictureUrl: null }, owner: { username: "hoshi_art", displayName: "ほし ★", profilePictureUrl: null }, status: "resell", price: 150, createdAt: "2026-04-04T00:00:00.000Z", tags: [{ name: "Bunny", color: "#D4A0FF", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-5", number: 5, imageUrl: "https://picsum.photos/seed/wf5/400/500", artist: { username: "rayne_draws", displayName: "Rayne 🌧️", profilePictureUrl: null }, owner: { username: "rayne_draws", displayName: "Rayne 🌧️", profilePictureUrl: null }, status: "open", price: 500, createdAt: "2026-04-05T00:00:00.000Z", tags: [{ name: "Wolf", color: "#A0C4FF", category: { name: "Species", color: "#FF6B6B" } }, { name: "Dark", color: "#555", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-6", number: 6, imageUrl: "https://picsum.photos/seed/wf6/400/500", artist: { username: "tora_studio", displayName: "Tiger Studio 🐯", profilePictureUrl: null }, owner: { username: "tora_studio", displayName: "Tiger Studio 🐯", profilePictureUrl: null }, status: "open", price: 280, createdAt: "2026-04-06T00:00:00.000Z", tags: [{ name: "Tiger", color: "#FFB347", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-7", number: 7, imageUrl: "https://picsum.photos/seed/wf7/400/500", artist: { username: "niji_colors", displayName: "にじ 🌈", profilePictureUrl: null }, owner: { username: "niji_colors", displayName: "にじ 🌈", profilePictureUrl: null }, status: "close", price: 420, createdAt: "2026-04-07T00:00:00.000Z", tags: [{ name: "Fairy", color: "#FF9ECD", category: { name: "Species", color: "#FF6B6B" } }, { name: "Glitter", color: "#FFFACD", category: { name: "Trait", color: "#9B59B6" } }] },
  { id: "mock-8", number: 8, imageUrl: "https://picsum.photos/seed/wf8/400/500", artist: { username: "stellar_art", displayName: "Stellar ✨", profilePictureUrl: null }, owner: { username: "stellar_art", displayName: "Stellar ✨", profilePictureUrl: null }, status: "open", price: 200, createdAt: "2026-04-08T00:00:00.000Z", tags: [{ name: "Demon", color: "#FF6060", category: { name: "Species", color: "#FF6B6B" } }], isNsfw: true },
  { id: "mock-9", number: 9, imageUrl: "https://picsum.photos/seed/wf9/400/500", artist: { username: "aqua_sketch", displayName: "Aqua 💧", profilePictureUrl: null }, owner: { username: "aqua_sketch", displayName: "Aqua 💧", profilePictureUrl: null }, status: "resell", price: 360, createdAt: "2026-04-09T00:00:00.000Z", tags: [{ name: "Merfolk", color: "#40E0D0", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-10", number: 10, imageUrl: "https://picsum.photos/seed/wf10/400/500", artist: { username: "ember_arts", displayName: "Ember 🔥", profilePictureUrl: null }, owner: { username: "ember_arts", displayName: "Ember 🔥", profilePictureUrl: null }, status: "open", price: 600, createdAt: "2026-04-10T00:00:00.000Z", tags: [{ name: "Phoenix", color: "#FF8C00", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-11", number: 11, imageUrl: "https://picsum.photos/seed/wf11/400/500", artist: { username: "crystal_draw", displayName: "Crystal 💎", profilePictureUrl: null }, owner: { username: "crystal_draw", displayName: "Crystal 💎", profilePictureUrl: null }, status: "open", price: 380, createdAt: "2026-04-11T00:00:00.000Z", tags: [{ name: "Elf", color: "#B0FFB0", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-12", number: 12, imageUrl: "https://picsum.photos/seed/wf12/400/500", artist: { username: "vivi_lineart", displayName: "Vivi 🌸", profilePictureUrl: null }, owner: { username: "vivi_lineart", displayName: "Vivi 🌸", profilePictureUrl: null }, status: "close", price: 240, createdAt: "2026-04-12T00:00:00.000Z", tags: [{ name: "Angel", color: "#FFFACD", category: { name: "Species", color: "#FF6B6B" } }], isNsfw: true },
  { id: "mock-13", number: 13, imageUrl: "https://picsum.photos/seed/wf13/400/500", artist: { username: "parareem_preme", displayName: "พรีม ☆彡", profilePictureUrl: "https://cdn.discordapp.com/avatars/272227350895394816/6f8335e9940c524a316357f2d73d119f.png" }, owner: { username: "parareem_preme", displayName: "พรีม ☆彡", profilePictureUrl: null }, status: "open", price: 450, createdAt: "2026-04-13T00:00:00.000Z", tags: [{ name: "Kitsune", color: "#40F0E8", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-14", number: 14, imageUrl: "https://picsum.photos/seed/wf14/400/500", artist: { username: "haruki_sketch", displayName: "Haruki 🍃", profilePictureUrl: null }, owner: { username: "haruki_sketch", displayName: "Haruki 🍃", profilePictureUrl: null }, status: "resell", price: 120, createdAt: "2026-04-14T00:00:00.000Z", tags: [{ name: "Plant", color: "#90EE90", category: { name: "Species", color: "#FF6B6B" } }] },
  { id: "mock-15", number: 15, imageUrl: "https://picsum.photos/seed/wf15/400/500", artist: { username: "nova_arts", displayName: "Nova 🌟", profilePictureUrl: null }, owner: { username: "nova_arts", displayName: "Nova 🌟", profilePictureUrl: null }, status: "open", price: 750, createdAt: "2026-04-15T00:00:00.000Z", tags: [{ name: "Cosmic", color: "#7B68EE", category: { name: "Species", color: "#FF6B6B" } }, { name: "Rare", color: "#FFD700", category: { name: "Trait", color: "#9B59B6" } }] },
];

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  open:   { label: "Open",   color: "#22c55e", bg: "#dcfce7" },
  resell: { label: "Resell", color: "#f59e0b", bg: "#fef3c7" },
  close:  { label: "Closed", color: "#6b7280", bg: "#f3f4f6" },
} as const;

// ── Card ──────────────────────────────────────────────────────────────────────

const AdoptableCard = ({ item, showNsfw }: { item: AdoptableListItem; showNsfw: boolean }) => {
  const theme = useTheme();
  const blurred = item.isNsfw && !showNsfw;
  const cfg = STATUS_CONFIG[item.status];

  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: theme.shadows[2],
        transition: "transform 0.22s, box-shadow 0.22s",
        "&:hover": { transform: "translateY(-6px)", boxShadow: theme.shadows[8] },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", width: "100%", paddingTop: "120%", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            filter: blurred ? "blur(18px)" : "none",
            transform: blurred ? "scale(1.1)" : "scale(1)",
            transition: "filter 0.3s",
          }}
        >
          <Image
            src={item.imageUrl}
            alt={`Adoptable #${item.number}`}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </Box>
        {blurred && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha("#000", 0.35),
            }}
          >
            <Typography variant="h6" color="white" fontWeight={700}>
              NSFW
            </Typography>
          </Box>
        )}
        {/* Status badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: cfg.bg,
            color: cfg.color,
            px: 1.2,
            py: 0.3,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          {cfg.label}
        </Box>
        {/* Number badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: alpha("#000", 0.55),
            color: "#fff",
            px: 1,
            py: 0.2,
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          #{item.number}
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Artist row */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={item.artist.profilePictureUrl ?? undefined}
            sx={{ width: 28, height: 28, fontSize: 12 }}
          >
            {item.artist.displayName[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Artist
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap>
              {item.artist.displayName}
            </Typography>
          </Box>
          {item.price != null && (
            <Box ml="auto" flexShrink={0}>
              <Typography variant="body2" fontWeight={800} color="primary.main">
                ฿{item.price.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Tags */}
        {item.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.tags.map((tag) => (
              <Chip
                key={tag.name}
                label={tag.name}
                size="small"
                sx={{
                  bgcolor: tag.color + "33",
                  color: "text.primary",
                  fontSize: 10,
                  height: 20,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            ))}
          </Box>
        )}

        {/* Action */}
        {item.externalUrl && (
          <Box mt="auto" pt={1}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              endIcon={<IconExternalLink size={14} />}
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2, textTransform: "none", fontSize: 12 }}
            >
              View post
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

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
          const data: AdoptableListItem[] = json?.data ?? json;
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
            {isLoading ? "Loading..." : `${filtered.length} ตัวละคร`}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Filter Panel ── */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
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
                  placeholder="เลือก artist..."
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
              {(["open", "resell", "close"] as const).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const active = statusFilter.includes(s);
                return (
                  <Chip
                    key={s}
                    label={cfg.label}
                    onClick={() => toggleChip(statusFilter, setStatusFilter, s)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      bgcolor: active ? cfg.color : cfg.bg,
                      color: active ? "#fff" : cfg.color,
                      border: `1.5px solid ${cfg.color}`,
                      "&:hover": { bgcolor: cfg.color, color: "#fff" },
                    }}
                  />
                );
              })}
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
                      <Chip
                        key={cat}
                        label={cat}
                        onClick={() => toggleChip(categoryFilter, setCategoryFilter, cat)}
                        variant={active ? "filled" : "outlined"}
                        color={active ? "primary" : "default"}
                        sx={{ cursor: "pointer", fontWeight: 600 }}
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
                        <Chip
                          label={tag.name}
                          onClick={() => toggleChip(tagFilter, setTagFilter, tag.name)}
                          size="small"
                          sx={{
                            cursor: "pointer",
                            fontWeight: 600,
                            bgcolor: active ? tag.color : "transparent",
                            color: "text.primary",
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
          </Box>
        </Grid>

        {/* ── Card Grid ── */}
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
              <MenuItem value="price_asc">Price: Low → High</MenuItem>
              <MenuItem value="price_desc">Price: High → Low</MenuItem>
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
                ไม่พบ adoptable ที่ตรงกับ filter
              </Typography>
              <Button onClick={clearAll} variant="outlined" sx={{ mt: 2, borderRadius: 3, textTransform: "none" }}>
                Clear filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {filtered.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <AdoptableCard item={item} showNsfw={nsfwFilter !== "sfw"} />
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
