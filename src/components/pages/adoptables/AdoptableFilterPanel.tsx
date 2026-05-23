"use client";
import React from "react";
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
import { alpha, useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { IconSearch, IconX } from "@tabler/icons-react";
import { BaseCard, BaseChip } from "@/common/components/base";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import type { ArtistMaster, AdoptableTagCategory, PaymentMethodMaster } from "@/common/hooks/useMasterData";

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
  showNsfw: boolean;
  onShowNsfwChange: (checked: boolean) => void;
  artistFilter: ArtistMaster | null;
  onArtistFilterChange: (v: ArtistMaster | null) => void;
  paymentMethodFilter: string[];
  onPaymentMethodFilterChange: (v: string[]) => void;
  allPaymentMethods: PaymentMethodMaster[];
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
  showNsfw,
  onShowNsfwChange,
  artistFilter,
  onArtistFilterChange,
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  allPaymentMethods,
  activeFilterCount,
  onClearAll,
  allArtists,
  visibleTagCategories,
}) => {
  const theme = useTheme();

  const toggleChip = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <BaseCard
      sx={{
        borderRadius: 4,
        boxShadow: 1,
        position: { md: "sticky" },
        top: 80,
        maxHeight: { md: "calc(100vh - 100px)" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, overflowY: "auto", flex: 1, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { borderRadius: 2, bgcolor: "divider" } }}>
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


      {/* Status */}
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        Status
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
        {(["open", "resell", "closed", "pending", "rejected", "deleted"] as const).map((s) => (
          <BaseChip
            key={s}
            preset={s}
            variant={statusFilter.includes(s) ? "filled" : "outlined"}
            onClick={() => toggleChip(statusFilter, onStatusFilterChange, s)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* Payment Method */}
      {allPaymentMethods.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} mb={1.25}>
            Payment Method
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
            {allPaymentMethods.map((pm) => {
              const active = paymentMethodFilter.includes(pm.name);
              return (
                <Tooltip key={pm.id} title={pm.name} placement="top" arrow>
                  <Box
                    onClick={() => toggleChip(paymentMethodFilter, onPaymentMethodFilterChange, pm.name)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1.25,
                      py: 0.6,
                      borderRadius: 2,
                      border: `1.5px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                      cursor: "pointer",
                      transition: "border-color 120ms, background-color 120ms",
                      userSelect: "none",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={pm.iconUrl}
                      alt={pm.name}
                      sx={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      noWrap
                      sx={{ color: active ? "primary.main" : "text.primary", maxWidth: 80 }}
                    >
                      {pm.name}
                    </Typography>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </>
      )}

      {/* Tags grouped by category */}
      {visibleTagCategories.some((c) => c.tags.length > 0) && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
            Tags
          </Typography>
          {visibleTagCategories.filter((c) => c.tags.length > 0).map((cat, idx, arr) => {
            const catActive = categoryFilter.includes(cat.name);
            return (
              <Box key={cat.id}>
                {/* Category header — clickable to toggle whole category */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1}
                  mb={1}
                  onClick={() => toggleChip(categoryFilter, onCategoryFilterChange, cat.name)}
                  sx={{ cursor: "pointer", userSelect: "none", width: "fit-content" }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    textTransform="uppercase"
                    letterSpacing={0.8}
                    sx={{
                      color: catActive ? "primary.main" : "text.secondary",
                      transition: "color 120ms",
                    }}
                  >
                    {cat.name}
                  </Typography>
                  {catActive && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Stack>

                {/* Tags in this category */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: idx < arr.length - 1 ? 2 : 0 }}>
                  {cat.tags.map((tag) => {
                    const active = tagFilter.includes(tag.name);
                    const color = tag.color ?? cat.color ?? "#888";
                    return (
                      <BaseChip
                        key={tag.id}
                        label={tag.name}
                        onClick={(event) => {
                          event.currentTarget.blur();
                          toggleChip(tagFilter, onTagFilterChange, tag.name);
                        }}
                        disableRipple
                        variant={active ? "filled" : "outlined"}
                        sx={{
                          cursor: "pointer",
                          touchAction: "manipulation",
                          WebkitTapHighlightColor: "transparent",
                          bgcolor: active ? color : "transparent",
                          color: active ? "#fff" : "text.primary",
                          border: `1.5px solid ${color}`,
                          transition: "background-color 120ms ease, color 120ms ease",
                          "&:hover": { bgcolor: color, color: "#fff" },
                          "&:focus": { boxShadow: "none", bgcolor: active ? color : "transparent" },
                          "&.Mui-focusVisible": { boxShadow: "none", bgcolor: active ? color : "transparent" },
                        }}
                      />
                    );
                  })}
                </Box>

                {idx < arr.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            );
          })}
        </>
      )}
      </Box>
    </BaseCard>
  );
};

export default AdoptableFilterPanel;
