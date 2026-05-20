"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, keyframes } from "@mui/material/styles";
import { IconArrowRight, IconEye, IconEyeOff } from "@tabler/icons-react";
import { BaseButton } from "@/common/components/base";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import AdoptableCard, { AdoptableListItem } from "@/components/pages/adoptables/AdoptableCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";



// ── Keyframes ─────────────────────────────────────────────────────────────────

const scrollLeft = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

// ── Styled ────────────────────────────────────────────────────────────────────

const TrackLeft = styled(Box)({
  display: "flex",
  width: "max-content",
  animation: `${scrollLeft} 80s linear infinite`,
  "&:hover": { animationPlayState: "paused" },
});

const TrackRight = styled(Box)({
  display: "flex",
  width: "max-content",
  animation: `${scrollRight} 80s linear infinite`,
  "&:hover": { animationPlayState: "paused" },
});



// ── Row ───────────────────────────────────────────────────────────────────────

// Repeat items array until we have at least `min` entries for seamless scroll
function fillItems(items: AdoptableListItem[], min = 12): AdoptableListItem[] {
  if (items.length === 0) return [];
  const result: AdoptableListItem[] = [];
  while (result.length < min) result.push(...items);
  return result;
}

const Row = ({ items, direction, offset = 0, sfw }: { items: AdoptableListItem[]; direction: "left" | "right"; offset?: number; sfw: boolean }) => {
  // Fill to at least 12 items then double for seamless loop
  const filled = fillItems(items);
  // Apply offset so each row shows different cards first
  const shifted = [...filled.slice(offset % filled.length), ...filled.slice(0, offset % filled.length)];
  const doubled = [...shifted, ...shifted];
  const Track = direction === "left" ? TrackLeft : TrackRight;
  return (
    <Box sx={{ overflow: "hidden", width: "100%" }}>
      <Track>
        {doubled.map((item, i) => (
          <AdoptableCard
            key={`${item.id}-${i}`}
            item={item}
            showViewPost={false}
            sx={{ width: 260, mx: 1, my: 4, flexShrink: 0, "&:hover": { transform: "scale(1.04)" } }}
          />
        ))}
      </Track>
    </Box>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const AdoptableShowcase = () => {
  const [items, setItems] = useState<AdoptableListItem[]>([]);
  const [dummy, setDummy] = useState(0);
  const showNsfw = typeof window !== "undefined" ? Cookies.get(CookiesKey.SFW_MODE) !== "false" : true;

  const toggleShowNsfw = (checked: boolean) => {
    Cookies.set(CookiesKey.SFW_MODE, String(checked), setCookiesOption1Y);
    setDummy((d) => d + 1);
  };

  useEffect(() => {
    const fetchAdoptables = async () => {
      try {
        const res = await fetch(`${API_URL}/adoptable`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (res.ok) {
          const json = await res.json();
          const data: AdoptableListItem[] = json?.data ?? json;
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch {
        // API error — show nothing
      }
    };
    fetchAdoptables();
  }, []);

  if (items.length === 0) return null;

  // All rows use the same items but with different starting offsets
  const offset2 = Math.floor(items.length / 3);
  const offset3 = Math.floor((items.length * 2) / 3);

  return (
    <Box sx={{ py: 8, overflow: "hidden" }}>
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" fontWeight={700}>
              Adoptables
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              ตัวละครรับเลี้ยงจากศิลปินในชุมชน
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SeeNSFWContentToggle value={showNsfw} onChange={toggleShowNsfw} />
            <BaseButton
              href="/adoptables"
              variant="outlined"
              label="View all"
              fullWidth={false}
              endIcon={<IconArrowRight size={18} />}
            />
          </Stack>
        </Stack>
      </Container>
      <Row items={items} direction="left" offset={0} sfw={showNsfw} />
      <Row items={items} direction="right" offset={offset2} sfw={showNsfw} />
      <Row items={items} direction="left" offset={offset3} sfw={showNsfw} />
    </Box>
  );
};

export default AdoptableShowcase;
