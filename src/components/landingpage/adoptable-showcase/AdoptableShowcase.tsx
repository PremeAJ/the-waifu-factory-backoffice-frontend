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

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ITEMS: AdoptableListItem[] = [
  {
    id: "mock-1",
    number: 1,
    imageUrl: "https://picsum.photos/seed/wf1/400/500",
    artist: { username: "sakura_draw", displayName: "さくら ✿", profilePictureUrl: null },
    owner: { username: "sakura_draw", displayName: "さくら ✿", profilePictureUrl: null },
    status: "open",
    price: 250,
    createdAt: "2026-04-01T00:00:00.000Z",
    tags: [{ name: "Neko", color: "#FFB3C1", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-2",
    number: 2,
    imageUrl: "https://picsum.photos/seed/wf2/400/500",
    artist: { username: "moonlight_art", displayName: "Moonlight 🌙", profilePictureUrl: null },
    owner: { username: "moonlight_art", displayName: "Moonlight 🌙", profilePictureUrl: null },
    status: "close",
    price: 180,
    createdAt: "2026-04-02T00:00:00.000Z",
    tags: [{ name: "Fox", color: "#FFD580", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-3",
    number: 3,
    imageUrl: "https://picsum.photos/seed/wf3/400/500",
    artist: { username: "yuki_creates", displayName: "Yuki ❄️", profilePictureUrl: null },
    owner: { username: "yuki_creates", displayName: "Yuki ❄️", profilePictureUrl: null },
    status: "open",
    price: 320,
    createdAt: "2026-04-03T00:00:00.000Z",
    tags: [{ name: "Dragon", color: "#80D4FF", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-4",
    number: 4,
    imageUrl: "https://picsum.photos/seed/wf4/400/500",
    artist: { username: "hoshi_art", displayName: "ほし ★", profilePictureUrl: null },
    owner: { username: "hoshi_art", displayName: "ほし ★", profilePictureUrl: null },
    status: "resell",
    price: 150,
    createdAt: "2026-04-04T00:00:00.000Z",
    tags: [{ name: "Bunny", color: "#D4A0FF", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-5",
    number: 5,
    imageUrl: "https://picsum.photos/seed/wf5/400/500",
    artist: { username: "rayne_draws", displayName: "Rayne 🌧️", profilePictureUrl: null },
    owner: { username: "rayne_draws", displayName: "Rayne 🌧️", profilePictureUrl: null },
    status: "open",
    price: 500,
    createdAt: "2026-04-05T00:00:00.000Z",
    tags: [{ name: "Wolf", color: "#A0C4FF", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-6",
    number: 6,
    imageUrl: "https://picsum.photos/seed/wf6/400/500",
    artist: { username: "tora_studio", displayName: "Tiger Studio 🐯", profilePictureUrl: null },
    owner: { username: "tora_studio", displayName: "Tiger Studio 🐯", profilePictureUrl: null },
    status: "open",
    price: 280,
    createdAt: "2026-04-06T00:00:00.000Z",
    tags: [{ name: "nsfw", color: "#FFB347", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-7",
    number: 7,
    imageUrl: "https://picsum.photos/seed/wf7/400/500",
    artist: { username: "niji_colors", displayName: "にじ 🌈", profilePictureUrl: null },
    owner: { username: "niji_colors", displayName: "にじ 🌈", profilePictureUrl: null },
    status: "close",
    price: 420,
    createdAt: "2026-04-07T00:00:00.000Z",
    tags: [{ name: "Fairy", color: "#FF9ECD", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-8",
    number: 8,
    imageUrl: "https://picsum.photos/seed/wf8/400/500",
    artist: { username: "stellar_art", displayName: "Stellar ✨", profilePictureUrl: null },
    owner: { username: "stellar_art", displayName: "Stellar ✨", profilePictureUrl: null },
    status: "open",
    price: 200,
    createdAt: "2026-04-08T00:00:00.000Z",
    tags: [{ name: "Demon", color: "#FF6060", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-9",
    number: 9,
    imageUrl: "https://picsum.photos/seed/wf9/400/500",
    artist: { username: "aqua_sketch", displayName: "Aqua 💧", profilePictureUrl: null },
    owner: { username: "aqua_sketch", displayName: "Aqua 💧", profilePictureUrl: null },
    status: "resell",
    price: 360,
    createdAt: "2026-04-09T00:00:00.000Z",
    tags: [{ name: "Merfolk", color: "#40E0D0", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-10",
    number: 10,
    imageUrl: "https://picsum.photos/seed/wf10/400/500",
    artist: { username: "ember_arts", displayName: "Ember 🔥", profilePictureUrl: null },
    owner: { username: "ember_arts", displayName: "Ember 🔥", profilePictureUrl: null },
    status: "open",
    price: 600,
    createdAt: "2026-04-10T00:00:00.000Z",
    tags: [{ name: "Phoenix", color: "#FF8C00", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-11",
    number: 11,
    imageUrl: "https://picsum.photos/seed/wf11/400/500",
    artist: { username: "crystal_draw", displayName: "Crystal 💎", profilePictureUrl: null },
    owner: { username: "crystal_draw", displayName: "Crystal 💎", profilePictureUrl: null },
    status: "open",
    price: 380,
    createdAt: "2026-04-11T00:00:00.000Z",
    tags: [{ name: "Elf", color: "#B0FFB0", category: { name: "Species", color: "#FF6B6B" } }],
  },
  {
    id: "mock-12",
    number: 12,
    imageUrl: "https://picsum.photos/seed/wf12/400/500",
    artist: { username: "vivi_lineart", displayName: "Vivi 🌸", profilePictureUrl: null },
    owner: { username: "vivi_lineart", displayName: "Vivi 🌸", profilePictureUrl: null },
    status: "close",
    price: 240,
    createdAt: "2026-04-12T00:00:00.000Z",
    tags: [{ name: "Angel", color: "#FFFACD", category: { name: "Species", color: "#FF6B6B" } }],
  },
];

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
  animation: `${scrollLeft} 40s linear infinite`,
  "&:hover": { animationPlayState: "paused" },
});

const TrackRight = styled(Box)({
  display: "flex",
  width: "max-content",
  animation: `${scrollRight} 40s linear infinite`,
  "&:hover": { animationPlayState: "paused" },
});



// ── Row ───────────────────────────────────────────────────────────────────────

const Row = ({ items, direction, sfw }: { items: AdoptableListItem[]; direction: "left" | "right"; sfw: boolean }) => {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
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
  const [items, setItems] = useState<AdoptableListItem[]>(MOCK_ITEMS);
  const [showNsfw, setShowNsfw] = useState(() => Cookies.get(CookiesKey.SFW_MODE) !== "false");

  // Sync cookie on toggle
  const toggleShowNsfw = (checked: boolean) => {
    setShowNsfw(checked);
    Cookies.set(CookiesKey.SFW_MODE, String(checked), setCookiesOption1Y);
  };

  useEffect(() => {
    const fetchAdoptables = async () => {
      try {
        const res = await fetch(`${API_URL}/adoptable`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (res.ok) {
          const json = await res.json();
          let data: AdoptableListItem[] = json?.data ?? json;
          // Map API field isNSFW to isNsfw for compatibility
          if (Array.isArray(data)) {
            data = data.map((item) => ({
              ...item,
              isNsfw: typeof item.isNSFW !== "undefined" ? item.isNSFW : item.isNSFW,
            }));
            if (data.length > 0) {
              setItems([...data, ...MOCK_ITEMS]);
            }
          }
        }
      } catch {
        // Use mock data on error
      }
    };
    fetchAdoptables();
  }, []);

  // Split items into 3 rows (cycle through them)
  const perRow = Math.ceil(items.length / 3);
  const row1 = items.slice(0, perRow);
  const row2 = items.slice(perRow, perRow * 2);
  const row3 = items.slice(perRow * 2);

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
      <Row items={row1.length ? row1 : MOCK_ITEMS} direction="left" sfw={showNsfw} />
      <Row items={row2.length ? row2 : MOCK_ITEMS} direction="right" sfw={showNsfw} />
      <Row items={row3.length ? row3 : MOCK_ITEMS} direction="left" sfw={showNsfw} />
    </Box>
  );
};

export default AdoptableShowcase;
