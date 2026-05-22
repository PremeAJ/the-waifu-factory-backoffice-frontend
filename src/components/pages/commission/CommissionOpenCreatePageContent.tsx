"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { IconArrowLeft, IconCurrencyDollar, IconUsers } from "@tabler/icons-react";

const CommissionOpenCreatePageContent = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    maxSlots: "1",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.maxSlots) return;
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, any> = {
        title: form.title,
        maxSlots: Number(form.maxSlots),
      };
      if (form.description) body.description = form.description;
      if (form.price)        body.price        = Number(form.price);

      const res = await postFetcher("/api/commission/open", body);
      if (res?.data?.id) router.push(`/commission/open/${res.data.id}`);
      else setError(res?.message ?? "Failed to open slot");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slotsNum = Number(form.maxSlots) || 0;

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Button
        startIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        sx={{ textTransform: "none", mb: 3, color: "text.secondary" }}
      >
        Back
      </Button>

      <Typography variant="h5" fontWeight={800} mb={0.5}>Open Commission Slot</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Let clients book a commission slot with you
      </Typography>

      <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>

            <TextField label="Title" value={form.title} onChange={set("title")} required fullWidth placeholder="e.g. Full Body Illustration" />

            <TextField
              label="Description"
              value={form.description}
              onChange={set("description")}
              fullWidth
              multiline
              rows={4}
              placeholder="Describe what's included, turnaround time, what you need from the client..."
            />

            <TextField
              label="Max Slots"
              value={form.maxSlots}
              onChange={set("maxSlots")}
              required
              fullWidth
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><IconUsers size={18} /></InputAdornment>,
                  inputProps: { min: 1, max: 100 },
                },
              }}
              helperText={slotsNum > 0 ? `You will accept up to ${slotsNum} client${slotsNum !== 1 ? "s" : ""}` : ""}
            />

            <TextField
              label="Price per slot (USD)"
              value={form.price}
              onChange={set("price")}
              fullWidth
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><IconCurrencyDollar size={18} /></InputAdornment>,
                  inputProps: { min: 0 },
                },
              }}
              helperText="Optional — leave blank for price on request"
            />

            {error && <Typography variant="body2" color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !form.title || !form.maxSlots}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, py: 1.4 }}
            >
              {loading ? "Opening..." : "Open Slot"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
};

export default CommissionOpenCreatePageContent;
