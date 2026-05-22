"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CookiesKey } from "@/common/constants/cookies";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconArrowLeft, IconClock, IconFlame, IconGavel } from "@tabler/icons-react";
import Image from "next/image";
import { BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { findMockAuction } from "./mockData";
import { timeRemaining } from "./AuctionCard";

const GLASS = 240;
const ZOOM  = 2.5;

const MOCK_BID_HISTORY = (item: ReturnType<typeof findMockAuction>) => {
  if (!item || item.bidCount === 0) return [];
  const bids = [];
  let bid = item.currentBid ?? item.startingBid;
  for (let i = item.bidCount; i >= 1; i--) {
    const minutesAgo = (item.bidCount - i + 1) * 47;
    const ts = new Date(Date.now() - minutesAgo * 60_000);
    bids.push({
      id: i,
      user: i % 2 === 0 ? "bidder_x" : "waifu_fan_99",
      displayName: i % 2 === 0 ? "bidder_x" : "WaifuFan99",
      amount: bid,
      at: ts.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    });
    bid -= item.minIncrement;
  }
  return bids;
};

const AuctionDetailPageContent = ({ id }: { id: string }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tagTextColor = isDark ? "#fff" : "#555";

  const [showNsfw, setShowNsfw] = useState(false);
  const [bidValue, setBidValue] = useState("");
  const [bidPlaced, setBidPlaced] = useState(false);

  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const item = findMockAuction(id);
  const blurred = item ? !showNsfw && !!item.isNSFW : false;
  const { label: timeLabel, isUrgent, isEnded } = item
    ? timeRemaining(item.endTime)
    : { label: "", isUrgent: false, isEnded: false };

  const bidHistory = item ? MOCK_BID_HISTORY(item) : [];
  const minNextBid = item
    ? (item.currentBid != null ? item.currentBid + item.minIncrement : item.startingBid)
    : 0;

  // Magnifier
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const magRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgContainerRef.current;
    const mag = magRef.current;
    if (!el || !mag) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mag.style.left = `${x - GLASS / 2}px`;
    mag.style.top  = `${y - GLASS / 2}px`;
    mag.style.backgroundSize     = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
    mag.style.backgroundPosition = `${-(x * ZOOM - GLASS / 2)}px ${-(y * ZOOM - GLASS / 2)}px`;
  }, []);

  const onMouseEnter = useCallback(() => {
    const mag = magRef.current;
    if (mag) mag.style.opacity = "1";
  }, []);

  const onMouseLeave = useCallback(() => {
    const mag = magRef.current;
    if (mag) mag.style.opacity = "0";
  }, []);

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Auction not found</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => router.push("/auctions")}>
          Back to Auctions
        </Button>
      </Container>
    );
  }

  const statusBg =
    item.status === "open"
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.error.main, 0.08);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Back link */}
      <Button
        startIcon={<IconArrowLeft size={16} />}
        onClick={() => router.push("/auctions")}
        sx={{ textTransform: "none", color: "text.secondary", mb: 3, px: 0 }}
      >
        Back to Auctions
      </Button>

      <Grid container spacing={4} alignItems="flex-start">

        {/* ── Image ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            ref={imgContainerRef}
            onMouseEnter={blurred ? undefined : onMouseEnter}
            onMouseMove={blurred ? undefined : onMouseMove}
            onMouseLeave={blurred ? undefined : onMouseLeave}
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: isDark
                ? "0 24px 64px rgba(0,0,0,0.55)"
                : "0 24px 64px rgba(0,0,0,0.13)",
              "@media (hover: hover)": { cursor: blurred ? "default" : "crosshair" },
            }}
          >
            <Image
              src={item.imageUrl}
              alt={`Auction #${item.number}`}
              width={0}
              height={0}
              sizes="(max-width: 960px) 100vw, 58vw"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: blurred ? "blur(20px)" : undefined,
                transform: blurred ? "scale(1.05)" : undefined,
              }}
              unoptimized
            />

            {!blurred && (
              <div
                ref={magRef}
                style={{
                  position: "absolute",
                  width: GLASS,
                  height: GLASS,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.88)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.08)",
                  zIndex: 10,
                  pointerEvents: "none",
                  backgroundImage: `url('${item.imageUrl}')`,
                  backgroundRepeat: "no-repeat",
                  opacity: 0,
                  transition: "opacity 0.15s ease",
                }}
              />
            )}

            {blurred && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha("#000", 0.35),
                  zIndex: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#fff", bgcolor: alpha("#000", 0.55), px: 2.5, py: 1, borderRadius: 2 }}
                >
                  🔞 NSFW
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── Info Card ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Card
              elevation={0}
              sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}
            >
              {/* Status bar */}
              <Box
                sx={{
                  px: 3,
                  py: 1.75,
                  bgcolor: statusBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BaseChip
                    preset={item.status === "open" ? "open" : "close"}
                    label={item.status === "open" ? "Live Auction" : item.status === "sold" ? "Sold" : "Closed"}
                    sx={{ fontWeight: 700 }}
                  />
                  {!isEnded && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: isUrgent ? alpha(theme.palette.error.main, 0.12) : alpha(theme.palette.text.secondary, 0.08),
                        color: isUrgent ? "error.main" : "text.secondary",
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {isUrgent ? <IconFlame size={13} /> : <IconClock size={13} />}
                      {timeLabel}
                    </Box>
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  #{item.number}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Series + current bid */}
                <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={1}>
                  {item.series.toUpperCase()}
                </Typography>

                {item.currentBid != null ? (
                  <Box mt={0.5}>
                    <Typography variant="h3" fontWeight={800} color="primary.main">
                      ${item.currentBid.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current bid · {item.bidCount} bid{item.bidCount !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                ) : (
                  <Box mt={0.5}>
                    <Typography variant="h4" fontWeight={700} color="text.secondary">
                      No bids yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Starting bid: ${item.startingBid}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2.5 }} />

                {/* SB / MI / AB row */}
                <Stack direction="row" spacing={0} divider={<Divider orientation="vertical" flexItem />}>
                  {[
                    { label: "Starting Bid", abbr: "SB", value: `$${item.startingBid}`, color: undefined },
                    { label: "Min. Increase", abbr: "MI", value: `$${item.minIncrement}`, color: undefined },
                    ...(item.autoBuy != null
                      ? [{ label: "Auto Buy", abbr: "AB", value: `$${item.autoBuy}`, color: "primary.main" }]
                      : []),
                  ].map((row) => (
                    <Box key={row.abbr} sx={{ flex: 1, textAlign: "center", px: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.4}>
                        {row.label}
                      </Typography>
                      <Typography fontWeight={700} fontSize={15} color={row.color ?? "text.primary"}>
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                {/* Artist */}
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                  Artist
                </Typography>
                <ArtistLink
                  username={item.artist.username}
                  displayName={item.artist.displayName}
                  profilePictureUrl={item.artist.profilePictureUrl}
                  avatarSize={44}
                  showUsername
                  sx={{ mt: 1.25, mb: 2.5 }}
                  endSlot={
                    item.artist.paymentMethods && item.artist.paymentMethods.length > 0 ? (
                      <Stack direction="row" spacing={0.75} flexShrink={0}>
                        {item.artist.paymentMethods.slice(0, 4).map((pm, i) => (
                          <Box
                            key={i}
                            component="img"
                            src={pm.iconUrl}
                            alt={pm.name}
                            title={`${pm.name}: ${pm.accountValue}`}
                            sx={{ height: 20, width: "auto", objectFit: "contain" }}
                          />
                        ))}
                      </Stack>
                    ) : undefined
                  }
                />

                {/* Tags */}
                {item.tags.length > 0 && (
                  <>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1}>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2.5 }}>
                      {item.tags.map((tag, i) => (
                        <BaseChip
                          key={i}
                          label={tag.name}
                          customBgColor={tag.color + "33"}
                          customColor={tagTextColor}
                          size="small"
                        />
                      ))}
                    </Box>
                  </>
                )}

                <Divider sx={{ mb: 2.5 }} />

                {/* Bid form */}
                {!isEnded && item.status === "open" ? (
                  <>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1.5}>
                      Place Bid
                    </Typography>
                    {bidPlaced ? (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                          textAlign: "center",
                        }}
                      >
                        <Typography fontWeight={700} color="success.main">
                          Bid placed! 🎉
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          You bid ${Number(bidValue).toLocaleString()} on Auction #{item.number}
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1.5}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder={`Min. $${minNextBid}`}
                          value={bidValue}
                          onChange={(e) => setBidValue(e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<IconGavel size={18} />}
                          disabled={!bidValue || Number(bidValue) < minNextBid}
                          onClick={() => setBidPlaced(true)}
                          sx={{ textTransform: "none", borderRadius: 2, py: 1.25, fontWeight: 700, fontSize: 15 }}
                        >
                          Place Bid
                        </Button>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                          Minimum bid: ${minNextBid.toLocaleString()}
                          {item.autoBuy != null && ` · Auto Buy: $${item.autoBuy.toLocaleString()}`}
                        </Typography>
                      </Stack>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", py: 1 }}>
                    <Typography fontWeight={700} color="text.secondary">
                      {item.status === "sold" ? "This item has been sold" : "This auction has ended"}
                    </Typography>
                    {item.currentBid != null && (
                      <Typography variant="caption" color="text.secondary">
                        Final price: ${item.currentBid.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Bid history */}
                {bidHistory.length > 0 && (
                  <>
                    <Divider sx={{ my: 2.5 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1.5}>
                      Bid History
                    </Typography>
                    <Stack spacing={1}>
                      {bidHistory.map((bid) => (
                        <Stack key={bid.id} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                              {bid.displayName[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" fontWeight={600} display="block" lineHeight={1.2}>
                                {bid.displayName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                                {bid.at}
                              </Typography>
                            </Box>
                          </Stack>
                          <Typography variant="caption" fontWeight={700} color={bid.id === bidHistory.length ? "primary.main" : "text.primary"}>
                            ${bid.amount.toLocaleString()}
                            {bid.id === bidHistory.length && (
                              <Box component="span" sx={{ ml: 0.5, color: "success.main", fontSize: 10 }}>
                                ▲ Top
                              </Box>
                            )}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}
              </Box>
            </Card>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
};

export default AuctionDetailPageContent;
