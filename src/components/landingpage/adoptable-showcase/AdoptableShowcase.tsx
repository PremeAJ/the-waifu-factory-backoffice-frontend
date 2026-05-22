"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconArrowRight } from "@tabler/icons-react";
import { BaseButton } from "@/common/components/base";
import SeeNSFWContentToggle from "@/common/components/shared/SeeNSFWContentToggle";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import AdoptableCard, { AdoptableListItem } from "@/components/pages/adoptables/AdoptableCard";

function fillItems(items: AdoptableListItem[], min = 12): AdoptableListItem[] {
  if (items.length === 0) return [];
  const result: AdoptableListItem[] = [];
  while (result.length < min) result.push(...items);
  return result;
}

interface RowProps {
  items: AdoptableListItem[];
  direction: "left" | "right";
  offset?: number;
  sfw: boolean;
}

const SPEED    = 0.04;  // px/ms (~40px/s)
const FRICTION = 0.92;  // momentum decay per frame

const Row = memo(function Row({ items, direction, offset = 0 }: RowProps) {
  const doubled = useMemo(() => {
    const filled = fillItems(items);
    if (filled.length === 0) return [];
    const off     = offset % filled.length;
    const shifted = off === 0 ? filled : [...filled.slice(off), ...filled.slice(0, off)];
    return [...shifted, ...shifted];
  }, [items, offset]);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef     = useRef<HTMLDivElement>(null);
  const halfRef      = useRef(0);
  const posRef       = useRef(0);
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartY   = useRef(0);
  const dragScroll   = useRef(0);
  const swipeDir     = useRef<"h" | "v" | null>(null);
  const momentum     = useRef(0); // px/ms — positive = moving right (decreases posRef)
  const lastTouchX   = useRef(0);
  const lastTouchT   = useRef(0);
  const rafRef       = useRef<number | null>(null);
  const lastTime     = useRef<number | null>(null);

  const dirFactor = direction === "left" ? 1 : -1;

  // Measure track half-width and set initial scroll position; keep it fresh on resize
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || doubled.length === 0) return;

    const init = () => {
      halfRef.current = inner.scrollWidth / 2;
      if (halfRef.current === 0) return;
      const first = inner.querySelector("[data-item]") as HTMLElement | null;
      if (!first) return;
      const cs    = getComputedStyle(first);
      const itemW = first.offsetWidth + parseFloat(cs.marginLeft || "0") + parseFloat(cs.marginRight || "0");
      const filledLen = doubled.length / 2;
      const start = ((offset % Math.max(filledLen, 1)) * itemW) % halfRef.current;
      posRef.current = start;
      inner.style.transform = `translateX(${-start}px)`;
    };

    init();
    const ro = new ResizeObserver(() => { halfRef.current = inner.scrollWidth / 2; });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [doubled, offset]);

  // RAF auto-scroll + momentum decay
  useEffect(() => {
    if (doubled.length === 0) return;
    const inner = innerRef.current;
    if (!inner) return;

    const step = (t: number) => {
      if (lastTime.current == null) lastTime.current = t;
      const dt = Math.min(t - lastTime.current, 50); // cap to avoid jump after tab switch
      lastTime.current = t;

      if (!isDragging.current) {
        const half = halfRef.current;
        if (half > 0) {
          if (Math.abs(momentum.current) > 0.0005) {
            momentum.current *= FRICTION;
          } else {
            momentum.current = 0;
          }
          let next = posRef.current + dirFactor * SPEED * dt - momentum.current * dt;
          if (next >= half) next -= half;
          if (next < 0)    next += half;
          posRef.current = next;
          inner.style.transform = `translateX(${-posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTime.current = null;
    };
  }, [doubled.length, dirFactor]);

  // Non-passive native touch listeners — required to call preventDefault() for horizontal swipes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      isDragging.current = true;
      swipeDir.current   = null;
      momentum.current   = 0;
      dragStartX.current = t.clientX;
      dragStartY.current = t.clientY;
      dragScroll.current = posRef.current;
      lastTouchX.current = t.clientX;
      lastTouchT.current = performance.now();
    };

    const onMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const t  = e.touches[0];
      const dx = t.clientX - dragStartX.current;
      const dy = t.clientY - dragStartY.current;

      // Determine swipe axis on first significant movement
      if (swipeDir.current === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        swipeDir.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
      }
      // Only intercept confirmed horizontal swipes — null/vertical let through so tap still fires click
      if (swipeDir.current !== "h") return;

      e.preventDefault(); // block page scroll for horizontal carousel swipe

      const now = performance.now();
      const dt  = now - lastTouchT.current;
      if (dt > 0) momentum.current = (t.clientX - lastTouchX.current) / dt;
      lastTouchX.current = t.clientX;
      lastTouchT.current = now;

      const inner = innerRef.current;
      if (!inner) return;
      const half = halfRef.current;
      let next = dragScroll.current - dx;
      if (half > 0) next = ((next % half) + half) % half;
      posRef.current = next;
      inner.style.transform = `translateX(${-posRef.current}px)`;
    };

    const onEnd = () => {
      isDragging.current = false;
      swipeDir.current   = null;
      // momentum.current keeps last velocity → RAF loop decays it with FRICTION
    };

    el.addEventListener("touchstart",  onStart, { passive: true });
    el.addEventListener("touchmove",   onMove,  { passive: false });
    el.addEventListener("touchend",    onEnd,   { passive: true });
    el.addEventListener("touchcancel", onEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart",  onStart);
      el.removeEventListener("touchmove",   onMove);
      el.removeEventListener("touchend",    onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  // Mouse/pointer drag — no setPointerCapture so click events reach cards naturally
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // handled by native touch listeners
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragScroll.current = posRef.current;
    momentum.current   = 0;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !isDragging.current) return;
    const inner = innerRef.current;
    if (!inner) return;
    const dx   = e.clientX - dragStartX.current;
    const half = halfRef.current;
    let next   = dragScroll.current - dx;
    if (half > 0) next = ((next % half) + half) % half;
    posRef.current = next;
    inner.style.transform = `translateX(${-posRef.current}px)`;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    isDragging.current = false;
  }, []);

  // End drag when mouse leaves or releases anywhere on the window
  useEffect(() => {
    const end = () => { isDragging.current = false; };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, []);

  if (doubled.length === 0) return null;

  return (
    <Box sx={{ overflow: "hidden", width: "100%" }}>
      <Box
        component="div"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
        sx={{
          overflow: "hidden",
          cursor: "grab",
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          mx: -1,
        }}
      >
        <Box component="div" ref={innerRef} sx={{ display: "flex", gap: 2, willChange: "transform" }}>
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} data-item>
              <AdoptableCard
                item={item}
                showViewPost={false}
                sx={{ width: 260, mx: 1, my: 4, flexShrink: 0 }}
              />
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

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

  const toggleShowNsfw = useCallback((checked: boolean) => {
    Cookies.set(CookiesKey.NSFW_MODE, String(checked), setCookiesOption1Y);
    setShowNsfw(checked);
  }, []);

  if (items.length === 0) return null;

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
      <Row items={items} direction="left"  offset={0}       sfw={showNsfw} />
      <Row items={items} direction="right" offset={offset2} sfw={showNsfw} />
      <Row items={items} direction="left"  offset={offset3} sfw={showNsfw} />
    </Box>
  );
};

export default AdoptableShowcase;
