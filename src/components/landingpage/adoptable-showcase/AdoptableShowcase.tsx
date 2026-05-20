"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, keyframes } from "@mui/material/styles";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdoptableUser {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

interface AdoptableTag {
  name: string;
  color: string;
  category: { name: string; color: string };
}

interface AdoptableListItem {
  id: string;
  number: number;
  imageUrl: string;
  externalUrl?: string;
  artist: AdoptableUser;
  owner: AdoptableUser;
  status: "open" | "close" | "resell";
  price?: number;
  createdAt: string;
  tags: AdoptableTag[];
}

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
    tags: [{ name: "Tiger", color: "#FFB347", category: { name: "Species", color: "#FF6B6B" } }],
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

// ── Status chip helper ────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, "success" | "default" | "warning"> = {
  open: "success",
  close: "default",
  resell: "warning",
};

// ── Card ──────────────────────────────────────────────────────────────────────

const AdoptableCard = ({ item }: { item: AdoptableListItem }) => (
  <Box
    sx={{
      width: 180,
      mx: 1,
      borderRadius: 3,
      overflow: "hidden",
      flexShrink: 0,
      cursor: "pointer",
      boxShadow: 2,
      bgcolor: "background.paper",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
    }}
    onClick={() => item.externalUrl && window.open(item.externalUrl, "_blank")}
  >
    <Box sx={{ position: "relative", width: 180, height: 220 }}>
      <Image
        src={item.imageUrl}
        alt={`Adoptable #${item.number}`}
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />
      <Chip
        label={item.status}
        color={STATUS_COLOR[item.status] ?? "default"}
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, fontWeight: 700, textTransform: "capitalize" }}
      />
    </Box>
    <Box sx={{ p: 1.2 }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary">
        #{item.number}
      </Typography>
      <Typography variant="body2" fontWeight={600} noWrap>
        {item.artist.displayName}
      </Typography>
      {item.price != null && (
        <Typography variant="caption" color="primary.main" fontWeight={700}>
          ฿{item.price.toLocaleString()}
        </Typography>
      )}
      {item.tags[0] && (
        <Box mt={0.5}>
          <Chip
            label={item.tags[0].name}
            size="small"
            sx={{ bgcolor: item.tags[0].color + "33", color: "text.primary", fontSize: 10 }}
          />
        </Box>
      )}
    </Box>
  </Box>
);

// ── Row ───────────────────────────────────────────────────────────────────────

const Row = ({ items, direction }: { items: AdoptableListItem[]; direction: "left" | "right" }) => {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  const Track = direction === "left" ? TrackLeft : TrackRight;
  return (
    <Box sx={{ overflow: "hidden", width: "100%", my: 1 }}>
      <Track>
        {doubled.map((item, i) => (
          <AdoptableCard key={`${item.id}-${i}`} item={item} />
        ))}
      </Track>
    </Box>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const AdoptableShowcase = () => {
  const [items, setItems] = useState<AdoptableListItem[]>(MOCK_ITEMS);

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
            // Merge with mock to get enough items for a full 3-row display
            setItems([...data, ...MOCK_ITEMS]);
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
          <Button
            component={Link}
            href="/adoptables"
            variant="outlined"
            endIcon={<IconArrowRight size={18} />}
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}
          >
            View all
          </Button>
        </Stack>
      </Container>
      <Row items={row1.length ? row1 : MOCK_ITEMS} direction="left" />
      <Row items={row2.length ? row2 : MOCK_ITEMS} direction="right" />
      <Row items={row3.length ? row3 : MOCK_ITEMS} direction="left" />
    </Box>
  );
};

export default AdoptableShowcase;
