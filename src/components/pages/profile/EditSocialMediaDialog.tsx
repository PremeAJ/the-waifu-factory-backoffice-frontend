"use client";
import React, { useState } from "react";
import { deleteFetcher, postFetcher } from "@/app/api/globalFetcher";
import { useSocialMedias, type SocialMediaMaster } from "@/common/hooks/useMasterData";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";

interface UserSocialMedia {
  name: string;
  iconUrl: string;
  url: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentSocialMedias: UserSocialMedia[];
  onMutate: () => void;
}

const EditSocialMediaDialog = ({ open, onClose, currentSocialMedias, onMutate }: Props) => {
  const theme = useTheme();
  const { socialMedias: masterList } = useSocialMedias();

  const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaMaster | null>(null);
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!selectedPlatform || !url.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await postFetcher("/api/user/me/social-medias", {
        socialMediaName: selectedPlatform.name,
        url: url.trim(),
      });
      if (res?.isSuccess || res?.data || res?.statusCode === 204 || res === undefined) {
        onMutate();
        setSelectedPlatform(null);
        setUrl("");
      } else {
        const msg = res?.message;
        setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Failed to add"));
      }
    } catch {
      setError("Failed to add social media");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (name: string) => {
    setDeletingName(name);
    setError("");
    try {
      await deleteFetcher(`/api/user/me/social-medias/${encodeURIComponent(name)}`, {});
      onMutate();
    } catch {
      setError("Failed to remove social media");
    } finally {
      setDeletingName(null);
    }
  };

  const availablePlatforms = masterList.filter(
    (m) => !currentSocialMedias.some((s) => s.name === m.name)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        Edit Social Media
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 12, top: 12 }}>
          <IconX size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Current list */}
        {currentSocialMedias.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {currentSocialMedias.map((sm) => (
              <Stack
                key={sm.name}
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                }}
              >
                <Avatar
                  src={sm.iconUrl}
                  variant="rounded"
                  sx={{ width: 24, height: 24, bgcolor: "transparent" }}
                >
                  {sm.name[0]}
                </Avatar>
                <Box minWidth={0} flex={1}>
                  <Typography variant="body2" fontWeight={600} noWrap>{sm.name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">{sm.url}</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(sm.name)}
                  disabled={deletingName === sm.name}
                  sx={{ color: "error.main", flexShrink: 0 }}
                >
                  {deletingName === sm.name
                    ? <CircularProgress size={14} color="error" />
                    : <IconTrash size={16} />}
                </IconButton>
              </Stack>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
            No social media linked yet
          </Typography>
        )}

        <Divider />

        {/* Add new */}
        <Typography variant="subtitle2" fontWeight={700}>Add new</Typography>
        <Autocomplete
          options={availablePlatforms}
          value={selectedPlatform}
          onChange={(_, v) => setSelectedPlatform(v)}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(a, b) => a.name === b.name}
          size="small"
          renderOption={({ key, ...props }, option) => (
            <Box key={key} component="li" {...props} sx={{ gap: 1 }}>
              <Avatar src={option.iconUrl} variant="rounded" sx={{ width: 20, height: 20, bgcolor: "transparent", flexShrink: 0 }}>
                {option.name[0]}
              </Avatar>
              <Typography variant="body2">{option.name}</Typography>
            </Box>
          )}
          renderInput={(params) => {
            if (selectedPlatform) {
              params.InputProps.startAdornment = (
                <>
                  <Avatar src={selectedPlatform.iconUrl} variant="rounded" sx={{ width: 20, height: 20, bgcolor: "transparent", ml: 0.5, mr: 0.5, flexShrink: 0 }}>
                    {selectedPlatform.name[0]}
                  </Avatar>
                  {params.InputProps.startAdornment}
                </>
              );
            }
            return (
              <TextField {...params} label="Platform" placeholder="Select platform..." sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            );
          }}
        />
        <Stack direction="row" gap={1}>
          <TextField
            label="URL"
            size="small"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAdd}
            disabled={!selectedPlatform || !url.trim() || adding}
            startIcon={adding ? <CircularProgress size={14} color="inherit" /> : <IconPlus size={16} />}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 2, flexShrink: 0 }}
          >
            Add
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSocialMediaDialog;
