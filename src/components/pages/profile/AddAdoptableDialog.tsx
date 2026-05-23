"use client";
import React, { useRef, useState } from "react";
import { postFetcher } from "@/app/api/globalFetcher";
import { useAdoptableTags, useArtists, useUsers, type ArtistMaster } from "@/common/hooks/useMasterData";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
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

const ArtistAutocomplete = ({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: ArtistMaster[];
  value: ArtistMaster | null;
  onChange: (v: ArtistMaster | null) => void;
  placeholder?: string;
}) => (
  <Autocomplete
    options={options}
    value={value}
    onChange={(_, v) => onChange(v)}
    getOptionLabel={(o) => o.displayName}
    isOptionEqualToValue={(a, b) => a.id === b.id}
    size="small"
    sx={{ flex: 1 }}
    renderOption={({ key, ...props }, option) => (
      <Box key={key} component="li" {...props} sx={{ gap: 1 }}>
        <Avatar src={option.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}>
          {option.displayName[0]}
        </Avatar>
        <Typography variant="body2" noWrap>{option.displayName}</Typography>
      </Box>
    )}
    renderInput={(params) => (
      <TextField {...params} label={label} placeholder={placeholder} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
    )}
  />
);

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAdoptableDialog = ({ open, onClose, onSuccess }: Props) => {
  const theme = useTheme();
  const { user } = useCurrentUser();
  const { adoptableTags } = useAdoptableTags();
  const { artists } = useArtists();
  const [ownerSearch, setOwnerSearch] = useState("");
  const { users, isLoading: usersLoading } = useUsers(ownerSearch);

  const selfArtist: ArtistMaster | null = user
    ? { id: user.id, username: user.username, displayName: user.displayName, profilePictureUrl: user.profilePictureUrl }
    : null;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState<"open" | "close" | "resell">("open");
  const [price, setPrice] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [artist, setArtist] = useState<ArtistMaster | null>(null);
  const [owner, setOwner] = useState<ArtistMaster | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!file || !user) return;
    setSubmitting(true);
    setError("");

    const resolvedArtist = artist ?? selfArtist;
    if (!resolvedArtist) return;

    const parsedPrice = price !== "" ? parseFloat(price) : undefined;
    const parsedNumber = number !== "" ? parseInt(number, 10) : undefined;

    if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice < 0)) {
      setError("Price must be a non-negative number");
      setSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("artistId", resolvedArtist.id);
    if (owner) form.append("ownerId", owner.id);
    form.append("status", status);
    form.append("isNSFW", String(isNsfw));
    if (parsedNumber !== undefined) form.append("number", String(parsedNumber));
    if (parsedPrice !== undefined) form.append("price", String(parsedPrice));
    if (postUrl) form.append("postUrl", postUrl);
    selectedTags.forEach((t) => form.append("tagNames", t));

    try {
      const res = await postFetcher("/api/adoptable", form);
      if (res?.isSuccess || res?.data) {
        onSuccess();
        handleClose();
      } else {
        const msg = res?.message;
        setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Something went wrong"));
      }
    } catch {
      setError("Failed to create adoptable");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setFile(null);
    setPreview(null);
    setNumber("");
    setStatus("open");
    setPrice("");
    setIsNsfw(false);
    setPostUrl("");
    setArtist(null);
    setOwner(null);
    setOwnerSearch("");
    setSelectedTags([]);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        Add Adoptable
        <IconButton onClick={handleClose} size="small" sx={{ position: "absolute", right: 12, top: 12 }}>
          <IconX size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

        {/* Image upload */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            Image <Typography component="span" color="error">*</Typography>
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && applyFile(e.target.files[0])}
          />
          {preview ? (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                component="img"
                src={preview}
                alt="preview"
                sx={{ width: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
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
            <Box
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: isDragging ? alpha(theme.palette.primary.main, 0.06) : "transparent",
                transition: "all 150ms",
                "&:hover": { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.04) },
              }}
            >
              <IconCloudUpload size={36} stroke={1.2} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Click or drag & drop an image here
              </Typography>
              <Typography variant="caption" color="text.disabled">PNG, JPG, WEBP · max 10MB</Typography>
            </Box>
          )}
        </Box>

        {/* Number + Status */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Number"
            type="number"
            size="small"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            sx={{ width: 120 }}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            label="Status"
            select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="close">Close</MenuItem>
            <MenuItem value="resell">Resell</MenuItem>
          </TextField>
        </Stack>

        {/* Price + NSFW */}
        <Stack direction="row" spacing={2} alignItems="center">
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
          label="Post URL (optional)"
          size="small"
          fullWidth
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://..."
        />

        {/* Artist + Owner */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <ArtistAutocomplete
            label="Artist"
            options={artists}
            value={artist ?? selfArtist}
            onChange={setArtist}
            placeholder="Search artist..."
          />
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
            sx={{ flex: 1 }}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Owner (optional)"
                placeholder="Search user..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            )}
          />
        </Stack>

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
          disabled={!file || submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}
        >
          {submitting ? "Uploading..." : "Add Adoptable"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdoptableDialog;
