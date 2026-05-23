"use client";
import React, { useState } from "react";
import { deleteFetcher, postFetcher, putFetcher } from "@/app/api/globalFetcher";
import { usePaymentMethods, type PaymentMethodMaster } from "@/common/hooks/useMasterData";
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
import { IconCheck, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";

interface UserPaymentMethod {
  name: string;
  iconUrl: string;
  accountValue: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentPaymentMethods: UserPaymentMethod[];
  onMutate: () => void;
}

const EditPaymentMethodDialog = ({ open, onClose, currentPaymentMethods, onMutate }: Props) => {
  const theme = useTheme();
  const { paymentMethods: masterList } = usePaymentMethods();

  const [selectedPlatform, setSelectedPlatform] = useState<PaymentMethodMaster | null>(null);
  const [accountValue, setAccountValue] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!selectedPlatform || !accountValue.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await postFetcher("/api/user/me/payment-methods", {
        paymentMethodName: selectedPlatform.name,
        accountValue: accountValue.trim(),
      });
      if (res?.isSuccess || res?.data || res?.statusCode === 204 || res === undefined) {
        onMutate();
        setSelectedPlatform(null);
        setAccountValue("");
      } else {
        const msg = res?.message;
        setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Failed to add"));
      }
    } catch {
      setError("Failed to add payment method");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (pm: UserPaymentMethod) => {
    setEditingName(pm.name);
    setEditValue(pm.accountValue);
    setError("");
  };

  const handleSaveEdit = async () => {
    if (!editingName || !editValue.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await putFetcher(`/api/user/me/payment-methods/${encodeURIComponent(editingName)}`, {
        accountValue: editValue.trim(),
      });
      if (res?.isSuccess || res?.data || res?.statusCode === 204 || res === undefined) {
        onMutate();
        setEditingName(null);
        setEditValue("");
      } else {
        const msg = res?.message;
        setError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Failed to update"));
      }
    } catch {
      setError("Failed to update payment method");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (name: string) => {
    setDeletingName(name);
    setError("");
    try {
      await deleteFetcher(`/api/user/me/payment-methods/${encodeURIComponent(name)}`, {});
      if (editingName === name) setEditingName(null);
      onMutate();
    } catch {
      setError("Failed to remove payment method");
    } finally {
      setDeletingName(null);
    }
  };

  const availablePlatforms = masterList.filter(
    (m) => !currentPaymentMethods.some((p) => p.name === m.name)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        Edit Payment Methods
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 12, top: 12 }}>
          <IconX size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Current list */}
        {currentPaymentMethods.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {currentPaymentMethods.map((pm) => (
              <Box key={pm.name}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: editingName === pm.name ? "8px 8px 0 0" : 2,
                    border: `1px solid ${editingName === pm.name ? theme.palette.primary.main : theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.text.primary, 0.02),
                  }}
                >
                  <Avatar
                    src={pm.iconUrl}
                    variant="rounded"
                    sx={{ width: 24, height: 24, bgcolor: "transparent", flexShrink: 0 }}
                  >
                    {pm.name[0]}
                  </Avatar>
                  <Box minWidth={0} flex={1}>
                    <Typography variant="body2" fontWeight={600} noWrap>{pm.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {pm.accountValue}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => editingName === pm.name ? setEditingName(null) : startEdit(pm)}
                    sx={{ color: editingName === pm.name ? "primary.main" : "text.secondary", flexShrink: 0 }}
                  >
                    {editingName === pm.name ? <IconX size={15} /> : <IconPencil size={15} />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(pm.name)}
                    disabled={deletingName === pm.name}
                    sx={{ color: "error.main", flexShrink: 0 }}
                  >
                    {deletingName === pm.name
                      ? <CircularProgress size={14} color="error" />
                      : <IconTrash size={15} />}
                  </IconButton>
                </Stack>

                {/* Inline edit */}
                {editingName === pm.name && (
                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      px: 1.5,
                      py: 1,
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Account / email / username"
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                      autoFocus
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveEdit}
                      disabled={!editValue.trim() || saving}
                      startIcon={saving ? <CircularProgress size={13} color="inherit" /> : <IconCheck size={15} />}
                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, flexShrink: 0 }}
                    >
                      Save
                    </Button>
                  </Stack>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
            No payment methods linked yet
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
            label="Account / email / username"
            size="small"
            fullWidth
            value={accountValue}
            onChange={(e) => setAccountValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAdd}
            disabled={!selectedPlatform || !accountValue.trim() || adding}
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

export default EditPaymentMethodDialog;
