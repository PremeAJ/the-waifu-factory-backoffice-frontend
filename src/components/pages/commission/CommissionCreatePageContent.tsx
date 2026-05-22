"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconArrowLeft, IconPhoto, IconX } from "@tabler/icons-react";

interface MasterUser {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

const CommissionCreatePageContent = () => {
  const router = useRouter();
  const theme  = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [form,     setForm]     = useState({ title: "", description: "", postUrl: "", price: "", isNSFW: false });
  const [artist,      setArtist]      = useState<MasterUser | null>(null);
  const [owner,       setOwner]       = useState<MasterUser | null>(null);
  const [artistInput, setArtistInput] = useState("");
  const [ownerInput,  setOwnerInput]  = useState("");
  const [artistQuery, setArtistQuery] = useState("");
  const [ownerQuery,  setOwnerQuery]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setArtistQuery(artistInput), 300);
    return () => clearTimeout(t);
  }, [artistInput]);

  useEffect(() => {
    const t = setTimeout(() => setOwnerQuery(ownerInput), 300);
    return () => clearTimeout(t);
  }, [ownerInput]);

  const artistParams: Record<string, any> = { limit: 20 };
  if (artistQuery) artistParams.search = artistQuery;
  const ownerParams: Record<string, any> = { limit: 20 };
  if (ownerQuery) ownerParams.search = ownerQuery;

  const { data: artistData } = useSWR(["/api/master/artist-list", artistParams], getFetcher, { revalidateOnFocus: false });
  const { data: userData }   = useSWR(["/api/master/user-list",   ownerParams],  getFetcher, { revalidateOnFocus: false });
  const artistOptions: MasterUser[] = artistData?.data ?? [];
  const userOptions:   MasterUser[] = userData?.data   ?? [];

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !form.title) return;
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", form.title);
      fd.append("isNSFW", String(form.isNSFW));
      if (form.description) fd.append("description", form.description);
      if (form.postUrl)     fd.append("postUrl",     form.postUrl);
      if (form.price)       fd.append("price",       form.price);
      if (artist)           fd.append("artistId",    artist.id);
      if (owner)            fd.append("ownerId",     owner.id);

      const res = await postFetcher("/api/commission", fd);
      if (!res?.data?.id) {
        setError(res?.message ?? "Failed to create commission");
        return;
      }

      router.push(`/commission/${res.data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Button
        startIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        sx={{ textTransform: "none", mb: 3, color: "text.secondary" }}
      >
        Back
      </Button>

      <Typography variant="h5" fontWeight={800} mb={3}>Post Commission</Typography>

      <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>

            {/* Image upload */}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

            {preview ? (
              <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
                <Box component="img" src={preview} alt="preview" sx={{ width: "100%", maxHeight: 320, objectFit: "contain", bgcolor: alpha("#000", 0.04) }} />
                <Button
                  size="small"
                  onClick={clearFile}
                  sx={{ position: "absolute", top: 8, right: 8, minWidth: 0, p: 0.5, bgcolor: alpha("#000", 0.55), color: "#fff", borderRadius: 1, "&:hover": { bgcolor: alpha("#000", 0.75) } }}
                >
                  <IconX size={16} />
                </Button>
              </Box>
            ) : (
              <Box
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                sx={{
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                  "&:hover": { borderColor: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                <IconPhoto size={40} style={{ opacity: 0.3, marginBottom: 8 }} />
                <Typography variant="body2" fontWeight={600}>Click or drag image here</Typography>
                <Typography variant="caption" color="text.secondary">PNG, JPG, WEBP</Typography>
              </Box>
            )}

            <TextField label="Title" value={form.title} onChange={set("title")} required fullWidth />

            <Autocomplete
              options={artistOptions}
              value={artist}
              onChange={(_, v) => setArtist(v)}
              inputValue={artistInput}
              onInputChange={(_, v, reason) => { if (reason !== "reset") setArtistInput(v); }}
              getOptionLabel={(o) => o.displayName}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              filterOptions={(x) => x}
              renderOption={(props, o) => (
                <Box component="li" {...props} key={o.id}>
                  <Stack direction="row" alignItems="center" spacing={1.2}>
                    <Avatar src={o.profilePictureUrl ?? undefined} sx={{ width: 28, height: 28, fontSize: 13 }}>
                      {o.displayName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} lineHeight={1.2}>{o.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">@{o.username}</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Artist"
                  placeholder="Search artist..."
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: artist ? (
                        <>
                          <Avatar src={artist.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 11, ml: 0.5, mr: -0.5 }}>
                            {artist.displayName[0]}
                          </Avatar>
                          {params.InputProps.startAdornment}
                        </>
                      ) : params.InputProps.startAdornment,
                    },
                  }}
                />
              )}
            />

            <Autocomplete
              options={userOptions}
              value={owner}
              onChange={(_, v) => setOwner(v)}
              inputValue={ownerInput}
              onInputChange={(_, v, reason) => { if (reason !== "reset") setOwnerInput(v); }}
              getOptionLabel={(o) => o.displayName}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              filterOptions={(x) => x}
              renderOption={(props, o) => (
                <Box component="li" {...props} key={o.id}>
                  <Stack direction="row" alignItems="center" spacing={1.2}>
                    <Avatar src={o.profilePictureUrl ?? undefined} sx={{ width: 28, height: 28, fontSize: 13 }}>
                      {o.displayName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} lineHeight={1.2}>{o.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">@{o.username}</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Owner"
                  placeholder="Search owner..."
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: owner ? (
                        <>
                          <Avatar src={owner.profilePictureUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: 11, ml: 0.5, mr: -0.5 }}>
                            {owner.displayName[0]}
                          </Avatar>
                          {params.InputProps.startAdornment}
                        </>
                      ) : params.InputProps.startAdornment,
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={set("description")}
              fullWidth multiline rows={3}
              placeholder="Tell us about this commission..."
            />

            <TextField
              label="Original Post URL"
              value={form.postUrl}
              onChange={set("postUrl")}
              fullWidth
              placeholder="https://twitter.com/..."
              helperText="Optional"
            />

            <TextField
              label="Price (USD)"
              value={form.price}
              onChange={set("price")}
              fullWidth type="number"
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              helperText="Optional"
            />

            <FormControlLabel
              control={<Switch checked={form.isNSFW} onChange={(e) => setForm((f) => ({ ...f, isNSFW: e.target.checked }))} color="error" />}
              label={<Typography variant="body2" fontWeight={600}>Mark as NSFW</Typography>}
            />

            {loading && (
              <Box>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                  Uploading...
                </Typography>
                <LinearProgress sx={{ borderRadius: 2 }} />
              </Box>
            )}

            {error && <Typography variant="body2" color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !file || !form.title}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, py: 1.4 }}
            >
              {loading ? "Uploading..." : "Post Commission"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
};

export default CommissionCreatePageContent;
