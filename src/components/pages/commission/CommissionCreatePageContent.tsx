"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { IconArrowLeft, IconPhoto } from "@tabler/icons-react";
import { BaseFileInput } from "@/common/components/base";

const CommissionCreatePageContent = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    description: "",
    postUrl: "",
    price: "",
    isNSFW: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl || !form.title) return;
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, any> = {
        imageUrl: form.imageUrl,
        title: form.title,
        isNSFW: form.isNSFW,
      };
      if (form.description) body.description = form.description;
      if (form.postUrl)     body.postUrl     = form.postUrl;
      if (form.price)       body.price       = Number(form.price);

      const res = await postFetcher("/api/commission", body);
      if (res?.data?.id) router.push(`/commission/${res.data.id}`);
      else setError(res?.message ?? "Failed to create commission");
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

      <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>

            {/* Image URL */}
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={set("imageUrl")}
              required
              fullWidth
              placeholder="https://..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><IconPhoto size={18} /></InputAdornment> } }}
            />

            {/* Preview */}
            {form.imageUrl && (
              <Box sx={{ borderRadius: 2, overflow: "hidden", maxHeight: 300 }}>
                <Box component="img" src={form.imageUrl} alt="preview" sx={{ width: "100%", height: "auto", objectFit: "cover" }} />
              </Box>
            )}

            <TextField label="Title" value={form.title} onChange={set("title")} required fullWidth />

            <TextField
              label="Description"
              value={form.description}
              onChange={set("description")}
              fullWidth
              multiline
              rows={3}
              placeholder="Tell us about this commission..."
            />

            <TextField
              label="Original Post URL"
              value={form.postUrl}
              onChange={set("postUrl")}
              fullWidth
              placeholder="https://twitter.com/..."
              helperText="Optional link to the original post"
            />

            <TextField
              label="Price (USD)"
              value={form.price}
              onChange={set("price")}
              fullWidth
              type="number"
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              helperText="Optional"
            />

            <FormControlLabel
              control={<Switch checked={form.isNSFW} onChange={(e) => setForm((f) => ({ ...f, isNSFW: e.target.checked }))} color="error" />}
              label={<Typography variant="body2" fontWeight={600}>Mark as NSFW</Typography>}
            />

            {error && <Typography variant="body2" color="error">{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !form.imageUrl || !form.title}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, py: 1.4 }}
            >
              {loading ? "Posting..." : "Post Commission"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
};

export default CommissionCreatePageContent;
