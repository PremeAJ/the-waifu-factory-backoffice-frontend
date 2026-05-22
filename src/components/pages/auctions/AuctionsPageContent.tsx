"use client";
import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { IconGavel } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import AuctionCard from "./AuctionCard";
import { MOCK_AUCTION_SERIES } from "./mockData";

const AuctionsPageContent = () => {
  const [showNsfw, setShowNsfw] = useState(false);

  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const handleToggleNsfw = useCallback((checked: boolean) => {
    Cookies.set(CookiesKey.NSFW_MODE, String(checked), setCookiesOption1Y);
    setShowNsfw(checked);
  }, []);

  const totalOpen = MOCK_AUCTION_SERIES.flatMap((s) => s.items).filter((i) => i.status === "open").length;

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* ── Page header ── */}
    
      {/* ── Category sections ── */}
      <Stack spacing={8}>
        {MOCK_AUCTION_SERIES.map((group) => (
          <Box key={group.name}>
            {/* Section header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
              <Box
                sx={{
                  width: 5,
                  height: 30,
                  borderRadius: 1,
                  bgcolor: group.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="h5" fontWeight={700}>
                {group.name}
              </Typography>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.3,
                  borderRadius: 2,
                  bgcolor: alpha(group.color, 0.12),
                  border: `1px solid ${alpha(group.color, 0.28)}`,
                }}
              >
                <Typography variant="caption" fontWeight={600} sx={{ color: group.color }}>
                  {group.items.length} items
                </Typography>
              </Box>
            </Stack>

            {/* 4-column grid */}
            <Grid container spacing={2.5}>
              {group.items.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <AuctionCard item={item} sx={{ height: "100%" }} />
                </Grid>
              ))}
            </Grid>

            {/* Accent separator */}
            <Box
              sx={{
                mt: 4,
                height: 1,
                background: `linear-gradient(to right, ${alpha(group.color, 0.5)} 0%, ${alpha(group.color, 0.1)} 60%, transparent 100%)`,
              }}
            />
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default AuctionsPageContent;
