"use client";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
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
});

const TrackRight = styled(Box)({
  display: "flex",
  width: "max-content",
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0); // current translate position in px (0..half)

  const directionFactor = direction === "left" ? 1 : -1;
  const speedPxPerMs = 0.04; // auto-scroll speed in px per ms (~40px/s) — reduced for smoothness

  // Measure sizes and set initial position according to offset
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    const first = inner.querySelector("[data-item]") as HTMLElement | null;
    if (!first) return;
    const style = getComputedStyle(first);
    const itemWidth = first.offsetWidth + parseFloat(style.marginLeft || "0") + parseFloat(style.marginRight || "0");
    const total = inner.scrollWidth;
    const half = total / 2 || 0;
    const start = ((offset % filled.length) * itemWidth) % half;
    posRef.current = start;
    inner.style.transform = `translateX(${-posRef.current}px)`;
    inner.style.willChange = "transform";
  }, [offset, filled.length]);

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    let started = false;
    let pollId: number | null = null;

    const startLoop = (container: HTMLDivElement) => {
      if (started) return;
      started = true;
      const inner = innerRef.current;
      if (!inner) return;
      const total = inner.scrollWidth;
      const half = total / 2 || 0;

      const step = (t: number) => {
        if (lastTime.current == null) lastTime.current = t;
        const dt = t - lastTime.current;
        lastTime.current = t;

        if (!isDragging.current && inner) {
          let next = posRef.current + directionFactor * speedPxPerMs * dt;
          if (half > 0) {
            if (next >= half) next -= half;
            if (next < 0) next += half;
          }
          posRef.current = next;
          inner.style.transform = `translateX(${-posRef.current}px)`;
        }

        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    };

    const tryStart = () => {
      const container = containerRef.current;
      if (container && container.children.length > 0) {
        if (pollId) { cancelAnimationFrame(pollId); pollId = null; }
        startLoop(container);
      } else {
        pollId = requestAnimationFrame(tryStart);
      }
    };

    tryStart();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pollId) cancelAnimationFrame(pollId);
      rafRef.current = null;
      lastTime.current = null;
    };
  }, [doubled.length, direction]);

  // Pointer handlers for dragging (translate-based)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = posRef.current;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    container.style.scrollBehavior = "auto";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    const inner = innerRef.current;
    if (!inner) return;
    const total = inner.scrollWidth;
    const half = total / 2 || 0;
    let next = dragStartScroll.current - dx;
    if (half > 0) {
      next = ((next % half) + half) % half;
    }
    posRef.current = next;
    inner.style.transform = `translateX(${-posRef.current}px)`;
  };

  const onPointerUp = () => {
    const container = containerRef.current;
    isDragging.current = false;
    if (container) container.style.scrollBehavior = "smooth";
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    isDragging.current = true;
    dragStartX.current = touch.clientX;
    dragStartScroll.current = posRef.current;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartX.current;
    const inner = innerRef.current;
    if (!inner) return;
    const total = inner.scrollWidth;
    const half = total / 2 || 0;
    let next = dragStartScroll.current - dx;
    if (half > 0) {
      next = ((next % half) + half) % half;
    }
    posRef.current = next;
    inner.style.transform = `translateX(${-posRef.current}px)`;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <Box component="div" sx={{ overflow: "hidden", width: "100%" }}>
      <Box
        component="div"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sx={{
          overflow: "hidden",
          cursor: "grab",
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          px: 0,
          mx: -1,
        }}
      >
        <Box component="div" ref={innerRef} sx={{ display: "flex", gap: 2, willChange: "transform" }}>
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} data-item>
              <AdoptableCard
                item={item}
                showViewPost={false}
                sx={{ width: 260, mx: 1, my: 4, flexShrink: 0, "&:hover": { transform: "scale(1.04)" } }}
              />
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const AdoptableShowcase = () => {
  const [showNsfw, setShowNsfw] = useState(false);

  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const { data: showcaseData } = useSWR("/api/adoptable/showcase", getFetcher, {
    refreshInterval: 35000,
    revalidateOnFocus: false,
  });

  const items: AdoptableListItem[] = showcaseData?.data ?? [];

  const toggleShowNsfw = (checked: boolean) => {
    Cookies.set(CookiesKey.NSFW_MODE, String(checked), setCookiesOption1Y);
    setShowNsfw(checked);
  };

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
              All adoptables are hand-drawn by our artists. Click on any card to learn more about the adoptable
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
