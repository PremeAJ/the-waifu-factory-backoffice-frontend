"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import { BaseChip } from "@/common/components/base";
import Cookies from "js-cookie";
import { CookiesKey } from "@/common/constants/cookies";
import { AdoptableListItem, AdoptableTag, isAdoptableNsfw } from "./AdoptableCard";
import ArtistLink from "@/common/components/shared/ArtistLink";

const GLASS = 260; // magnifier diameter px
const ZOOM  = 2.5; // zoom level

const AdoptableDetailPageContent = ({ id }: { id: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tagTextColor = isDark ? "#fff" : "#555";

  const [showNsfw, setShowNsfw] = useState(false);
  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const { data, isLoading } = useSWR(`/api/adoptable/${id}`, getFetcher, {
    revalidateOnFocus: false,
  });

  const item: AdoptableListItem | undefined = data?.data;
  const blurred = item ? !showNsfw && isAdoptableNsfw(item) : false;

  // Magnifier — DOM-direct updates to avoid re-renders on every mousemove
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rectangular" sx={{ borderRadius: 4, aspectRatio: "3/4", width: "100%" }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rectangular" height={560} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Adoptable not found</Typography>
      </Container>
    );
  }

  const statusBg =
    item.status === "open"
      ? alpha(theme.palette.success.main, 0.1)
      : item.status === "resell"
      ? alpha(theme.palette.warning.main, 0.1)
      : alpha(theme.palette.error.main, 0.08);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
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
            {/* Full image — natural aspect ratio, no crop */}
            <Image
              src={item.imageUrl}
              alt={`Adoptable #${item.number}`}
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

            {/* Magnifier glass — hidden until hover */}
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

            {/* NSFW overlay */}
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
                <BaseChip preset={item.status} sx={{ fontWeight: 700, textTransform: "capitalize" }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  #{item.number}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Price */}
                {item.price != null ? (
                  <Typography variant="h3" fontWeight={800} color="primary.main">
                    ${item.price.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="h5" fontWeight={700}>
                    Adoptable #{item.number}
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

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
                  sx={{ mt: 1.25, mb: 3 }}
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

                {/* Owner */}
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                  Owner
                </Typography>
                <ArtistLink
                  username={item.owner.username}
                  displayName={item.owner.displayName}
                  profilePictureUrl={item.owner.profilePictureUrl}
                  avatarSize={44}
                  showUsername
                  sx={{ mt: 1.25 }}
                />

                {/* Tags */}
                {item.tags.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1.25}>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {item.tags.map((tag: AdoptableTag, i: number) => (
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

                {/* CTA */}
                {item.postUrl && (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    href={item.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<IconExternalLink size={18} />}
                    sx={{ mt: 3.5, textTransform: "none", borderRadius: 2, py: 1.5, fontWeight: 700, fontSize: 15 }}
                  >
                    View Original Post
                  </Button>
                )}

                {/* Terms of Purchase */}
                <Divider sx={{ mt: 3.5, mb: 3 }} />
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1.75}>
                  Terms of Purchase
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", gap: 1, lineHeight: 1.6 }}>
                    <Box component="span" sx={{ color: "primary.main", fontWeight: 800, flexShrink: 0, mt: 0.1 }}>•</Box>
                    After you buy this character, it will officially become your own original character, which you have full copyright for and may use for private and commercial purposes. However, the original artist of your new character will have the right to post the artwork on their galleries for portfolio purposes.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", gap: 1, lineHeight: 1.6 }}>
                    <Box component="span" sx={{ color: "primary.main", fontWeight: 800, flexShrink: 0, mt: 0.1 }}>•</Box>
                    You agree that your character will be recorded in the server archive as proof of ownership and to track ownership.
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Note: Hold option is available only for{" "}
                    <Box component="span" sx={{ color: "warning.dark", fontWeight: 700 }}>"Waifu Shop Clients"</Box>
                  </Typography>
                </Box>

              </Box>
            </Card>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
};

export default AdoptableDetailPageContent;
