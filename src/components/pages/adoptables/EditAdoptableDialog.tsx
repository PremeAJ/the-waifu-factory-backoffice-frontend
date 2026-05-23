"use client";
import React, { useEffect, useRef, useState } from "react";
import { putFetcher } from "@/app/api/globalFetcher";
import { useAdoptableTags, useUsers, type ArtistMaster } from "@/common/hooks/useMasterData";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconCloudUpload, IconX } from "@tabler/icons-react";
import type { AdoptableListItem } from "./AdoptableCard";

const STATUS_COLOR: Record<string, string> = {
  open: "#2e7d32",
  resell: "#ed6c02",
  pending: "#ed6c02",
  closed: "#d32f2f",
  rejected: "#d32f2f",
  deleted: "#d32f2f",
};

const StatusDot = ({ status }: { status: string }) => (
  <Box
    component="span"
    sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLOR[status] ?? "#888", display: "inline-block", mr: 1, flexShrink: 0 }}
  />
);

interface Props {
  open: boolean;
  item: AdoptableListItem;
  onClose: () => void;
  onSuccess: (updated: AdoptableListItem) => void;
}

const EditAdoptableDialog = ({ open, item, onClose, onSuccess }: Props) => {
  const theme = useTheme();
  const { adoptableTags } = useAdoptableTags();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(item.status);
  const [price, setPrice] = useState(item.price != null ? String(item.price) : "");
  const [isNsfw, setIsNsfw] = useState(item.isNSFW ?? false);
  const [postUrl, setPostUrl] = useState(item.postUrl ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(item.tags.map((t) => t.name));
  const [owner, setOwner] = useState<ArtistMaster | null>(item.owner as unknown as ArtistMaster);
  const [ownerSearch, setOwnerSearch] = useState("");
  const { users, isLoading: usersLoading } = useUsers(ownerSearch);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when item changes (e.g. dialog reopened for different item)
  useEffect(() => {
    setStatus(item.status);
    setPrice(item.price != null ? String(item.price) : "");
    setIsNsfw(item.isNSFW ?? false);
    setPostUrl(item.postUrl ?? "");
    setSelectedTags(item.tags.map((t) => t.name));
    setFile(null);
    setPreview(null);
    setOwner(item.owner as unknown as ArtistMaster);
    setError("");
  }, [item.id]);

  const applyFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) applyFile(f);
  };

  const toggleTag = (name: string) =>
    setSelectedTags((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const parsedPrice = price !== "" ? parseFloat(price) : undefined;
    if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice < 0)) {
      setError("Price must be a non-negative number");
      setSubmitting(false);
      return;
    }

    const form = new FormData();
    if (file) form.append("file", file);
    if (owner && owner.username !== item.owner.username) form.append("ownerId", owner.id);
    form.append("status", status);
    form.append("isNSFW", String(isNsfw));
    if (parsedPrice !== undefined) form.append("price", String(parsedPrice));
    if (postUrl) form.append("postUrl", postUrl);
    selectedTags.forEach((t) => form.append("tagNames", t));

    try {
      const res = await putFetcher(`/api/adoptable/${item.id}`, form);
      if (res?.isSuccess || res?.data) {
        onSuccess(res.data ?? item);
        onClose();
      } else {
        const msg = res?.message;
        setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Something went wrong"));
      }
    } catch {
      setError("Failed to update adoptable");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        Edit Adoptable #{item.number}
        <IconButton onClick={handleClose} size="small" sx={{ position: "absolute", right: 12, top: 12 }}>
          <IconX size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

        {/* Image upload (optional) */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Image (optional — leave blank to keep current)</Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && applyFile(e.target.files[0])}
          />
          {preview ? (
            <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
              <Box
                component="img"
                src={preview}
                alt="preview"
                sx={{ width: "100%", maxHeight: 240, objectFit: "contain", borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
              />
              <IconButton
                size="small"
                onClick={() => { setFile(null); setPreview(null); }}
                sx={{ position: "absolute", top: 6, right: 6, bgcolor: alpha("#000", 0.55), color: "#fff", "&:hover": { bgcolor: alpha("#000", 0.75) } }}
              >
                <IconX size={14} />
              </IconButton>
            </Box>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={item.imageUrl}
                alt="current"
                sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 2, border: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}
              />
              <Box
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                sx={{
                  flex: 1,
                  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2.5,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: isDragging ? alpha(theme.palette.primary.main, 0.06) : "transparent",
                  transition: "all 150ms",
                  "&:hover": { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                <IconCloudUpload size={28} stroke={1.2} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" mt={0.5}>Click or drag to replace</Typography>
              </Box>
            </Stack>
          )}
        </Box>

        {/* Status + Price */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Status"
            select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            sx={{ flex: 1 }}
            slotProps={{
              select: {
                renderValue: (v) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StatusDot status={v as string} />
                    {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
                  </Box>
                ),
              },
            }}
          >
            {(["open", "closed", "resell"] as const).map((s) => (
              <MenuItem key={s} value={s} sx={{ display: "flex", alignItems: "center" }}>
                <StatusDot status={s} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Price ($)"
            type="number"
            size="small"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ flex: 1 }}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <FormControlLabel
            control={<Switch checked={isNsfw} onChange={(e) => setIsNsfw(e.target.checked)} color="error" />}
            label={<Typography variant="body2" fontWeight={600}>NSFW</Typography>}
          />
        </Stack>

        {/* Post URL */}
        <TextField
          label="Discord Post URL (optional)"
          size="small"
          fullWidth
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://discord.com/channels/..."
          helperText="Link to the original post on Discord"
        />

        {/* Owner */}
        <Autocomplete
          options={users}
          value={owner}
          onChange={(_, v) => setOwner(v)}
          getOptionLabel={(o) => o.displayName}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          loading={usersLoading}
          filterOptions={(x) => x}
          onInputChange={(_, v) => setOwnerSearch(v)}
          size="small"
          renderOption={({ key: _key, ...props }, option) => (
            <Box key={option.id} component="li" {...props} sx={{ gap: 1 }}>
              <Avatar src={option.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>
                {option.displayName[0]}
              </Avatar>
              <Box minWidth={0}>
                <Typography variant="body2" noWrap>{option.displayName}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>@{option.username}</Typography>
              </Box>
            </Box>
          )}
          renderInput={(params) => {
            if (owner) {
              params.InputProps.startAdornment = (
                <>
                  <InputAdornment position="start" sx={{ ml: 0.5 }}>
                    <Avatar
                      src={(owner as any).profilePictureUrl ?? undefined}
                      sx={{ width: 22, height: 22, fontSize: 10 }}
                    >
                      {owner.displayName[0]}
                    </Avatar>
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              );
            }
            return (
              <TextField
                {...params}
                label="Owner"
                placeholder="Search to change owner..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            );
          }}
        />

        {/* Tags */}
        {adoptableTags.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>Tags</Typography>
            {adoptableTags.filter((cat) => cat.tags.length > 0).map((cat, idx, arr) => (
              <Box key={cat.id}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing={0.8}
                  color="text.secondary"
                  display="block"
                  mb={0.75}
                >
                  {cat.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: idx < arr.length - 1 ? 1.5 : 0 }}>
                  {cat.tags.map((tag) => {
                    const active = selectedTags.includes(tag.name);
                    const color = tag.color ?? cat.color ?? "#888";
                    return (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        onClick={() => toggleTag(tag.name)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: active ? color : "transparent",
                          color: active ? "#fff" : "text.primary",
                          border: `1.5px solid ${color}`,
                          fontWeight: 600,
                          "&:hover": { bgcolor: color, color: "#fff" },
                        }}
                      />
                    );
                  })}
                </Box>
                {idx < arr.length - 1 && <Divider sx={{ my: 1.5 }} />}
              </Box>
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAdoptableDialog;
