"use client";
import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { IconSearch, IconX } from "@tabler/icons-react";
import { BaseCard, BaseChip } from "@/common/components/base";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import type { ArtistMaster, AdoptableTagCategory } from "@/common/hooks/useMasterData";

export interface AdoptableFilterPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (v: string[]) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (v: string[]) => void;
  tagFilter: string[];
  onTagFilterChange: (v: string[]) => void;
  nsfwFilter: "sfw" | "nsfw" | "all";
  onNsfwFilterChange: (v: "sfw" | "nsfw" | "all") => void;
  artistFilter: ArtistMaster | null;
  onArtistFilterChange: (v: ArtistMaster | null) => void;
  activeFilterCount: number;
  onClearAll: () => void;
  allArtists: ArtistMaster[];
  adoptableTags: AdoptableTagCategory[];
  visibleTagCategories: AdoptableTagCategory[];
}

const AdoptableFilterPanel: React.FC<AdoptableFilterPanelProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  tagFilter,
  onTagFilterChange,
  nsfwFilter,
  onNsfwFilterChange,
  artistFilter,
  onArtistFilterChange,
  activeFilterCount,
  onClearAll,
  allArtists,
  adoptableTags,
  visibleTagCategories,
}) => {
  const [dummy, setDummy] = useState(0);
  const showNsfw = typeof window !== "undefined" ? Cookies.get(CookiesKey.NSFW_MODE) === "true" : false;

  const toggleChip = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
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
            onClick={onClearAll}
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
        onChange={(e) => onSearchChange(e.target.value)}
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
        onChange={(_, v) => onArtistFilterChange(v)}
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
        onChange={(_, v) => v && onNsfwFilterChange(v)}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all" sx={{ textTransform: "none", fontWeight: 600 }}>
          All
        </ToggleButton>
        <ToggleButton value="sfw" sx={{ textTransform: "none", fontWeight: 600 }}>
          SFW
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
            setDummy((d) => d + 1);
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
            onClick={() => toggleChip(statusFilter, onStatusFilterChange, s)}
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
                  onClick={() => toggleChip(categoryFilter, onCategoryFilterChange, cat.name)}
                  variant={active ? "filled" : "outlined"}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    ...(active && { bgcolor: "primary.main", color: "primary.contrastText" }),
                  }}
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
                      onClick={() => toggleChip(tagFilter, onTagFilterChange, tag.name)}
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
  );
};

export default AdoptableFilterPanel;
