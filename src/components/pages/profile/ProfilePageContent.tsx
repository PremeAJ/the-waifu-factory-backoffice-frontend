"use client";
import React, { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getFetcher } from "@/app/api/globalFetcher";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import BaseLightBox, { LightboxItem } from "@/common/components/base/BaseLightBox";
import { BaseChip } from "@/common/components/base";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";
import { AdoptableListItem, isAdoptableNsfw } from "@/components/pages/adoptables/AdoptableCard";
import Cookies from "js-cookie";
import { CookiesKey } from "@/common/constants/cookies";
import {
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTwitch,
  IconLink,
  IconPencil,
  IconPhoto,
  IconHeart,
  IconBrush,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  createdAt: string;
  paymentMethods: { name: string; iconUrl: string; accountValue: string }[];
  socialMedias:   { name: string; iconUrl: string; url: string }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  discord:   <IconBrandDiscord  size={17} />,
  twitter:   <IconBrandTwitter  size={17} />,
  x:         <IconBrandTwitter  size={17} />,
  instagram: <IconBrandInstagram size={17} />,
  facebook:  <IconBrandFacebook  size={17} />,
  youtube:   <IconBrandYoutube   size={17} />,
  twitch:    <IconBrandTwitch    size={17} />,
};

const SocialIcon = ({ sm }: { sm: { name: string; iconUrl: string } }) => {
  if (sm.iconUrl) {
    return <Box component="img" src={sm.iconUrl} alt={sm.name} sx={{ width: 17, height: 17, objectFit: "contain" }} />;
  }
  return <>{SOCIAL_ICON_MAP[sm.name.toLowerCase()] ?? <IconLink size={17} />}</>;
};

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = ["Gallery", "Adoptable", "Commission", "Followers", "Following"] as const;
type TabKey = (typeof TABS)[number];

const MOCK_USERS = [
  { username: "artist_one",  displayName: "Artist One" },
  { username: "artist_two",  displayName: "Artist Two" },
  { username: "collector_3", displayName: "Collector Three" },
];

// ── Stat chip ─────────────────────────────────────────────────────────────────

const Stat = ({
  value,
  label,
  onClick,
}: {
  value: number | string;
  label: string;
  onClick?: () => void;
}) => (
  <Box
    textAlign="center"
    onClick={onClick}
    sx={{ cursor: onClick ? "pointer" : "default", "&:hover": onClick ? { opacity: 0.75 } : {} }}
  >
    <Typography fontWeight={800} variant="h5" lineHeight={1.1}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
      {label}
    </Typography>
  </Box>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
  <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
    <Box sx={{ opacity: 0.35 }}>{icon}</Box>
    <Typography variant="h6" mt={1.5} fontWeight={600}>{title}</Typography>
    {subtitle && <Typography variant="body2" mt={0.5}>{subtitle}</Typography>}
  </Box>
);

// ── Adoptable grid tab ────────────────────────────────────────────────────────

const AdoptableTab = ({ username }: { username: string }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showNsfw, setShowNsfw] = useState(false);

  useEffect(() => {
    setShowNsfw(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex > 0 && !previousPageData) return null;
    if (previousPageData && !previousPageData.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: 20 };
    if (pageIndex > 0 && previousPageData?.meta?.nextCursor) {
      params.cursor = previousPageData.meta.nextCursor;
    }
    return [`/api/user/${username}/adoptable`, params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, {
    revalidateOnFocus: false,
  });

  const pages = data ?? [];
  const items: AdoptableListItem[] = pages.flatMap((p) => p?.data ?? []);
  const meta = pages[pages.length - 1]?.meta;
  const isLoading = !data && isValidating;
  const hasMore = meta?.hasMore ?? false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);

  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  const lightboxItems: LightboxItem[] = items.map((item) => ({
    src: item.imageUrl,
    alt: `Adoptable #${item.number}`,
    caption: [
      `#${item.number}`,
      item.price != null ? `$${item.price}` : null,
      item.status,
      item.tags.map((t) => t.name).join(", "),
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  if (isLoading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
            <Skeleton variant="rectangular" sx={{ paddingTop: "100%", borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return <EmptyState icon={<IconHeart size={56} stroke={1.2} />} title="No adoptables yet" />;
  }

  return (
    <>
      <Grid container spacing={1.5}>
        {items.map((item, index) => {
          const blurred = !showNsfw && isAdoptableNsfw(item);
          return (
            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Box
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                sx={{
                  position: "relative",
                  paddingTop: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover .overlay": { opacity: 1 },
                  "&:hover img": { transform: blurred ? "scale(1.15)" : "scale(1.05)" },
                }}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={`Adoptable #${item.number}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: blurred ? "blur(12px)" : undefined,
                    transform: blurred ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.25s ease",
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.45)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.3 }}>
                    #{item.number}
                  </Typography>
                  {item.price != null && (
                    <Typography variant="caption" sx={{ color: "#fff", opacity: 0.85 }}>
                      ${item.price}
                    </Typography>
                  )}
                </Box>
                <BaseChip
                  preset={item.status}
                  size="small"
                  sx={{ position: "absolute", top: 6, left: 6, fontWeight: 700, zIndex: 1 }}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
      {hasMore && <Box ref={loadMoreRef} sx={{ height: 1, mt: 2 }} />}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            {isValidating ? "Loading..." : "Load more"}
          </Button>
        </Box>
      )}
      <BaseLightBox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onChangeIndex={setLightboxIndex}
      />
    </>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const ProfilePageContent = ({ username }: { username: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Gallery");

  const isOwnProfile = !!currentUser && currentUser.username === username;

  const { data, isLoading } = useSWR(`/api/user/${username}`, getFetcher, {
    revalidateOnFocus: false,
  });

  const profile = data?.data as PublicProfile | undefined;
  const notFound = !isLoading && data && (data.statusCode === 404 || !data.data);

  // ── Derived values ────────────────────────────────────────────────────────

  const accent = profile?.accentColor ?? theme.palette.primary.main;
  const bannerSx = profile?.bannerUrl
    ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${alpha(accent, 0.7)} 0%, ${alpha(accent, 0.25)} 100%)` };

  // ── Not found ─────────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box textAlign="center">
          <Typography variant="h3" mb={1}>User not found</Typography>
          <Typography color="text.secondary" mb={3}>@{username} doesn&apos;t exist.</Typography>
          <Button variant="outlined" onClick={() => router.push("/")}>Go Home</Button>
        </Box>
      </Box>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading || !profile) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>

      {/* ── Banner ── */}
      <Box sx={{ width: "100%", height: { xs: 180, md: 260 }, position: "relative", ...bannerSx }}>
        {/* subtle dark vignette so text is readable */}
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />

        {isOwnProfile && (
          <Button
            size="small"
            startIcon={<IconPencil size={14} />}
            onClick={() => router.push("/setting")}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#fff",
              bgcolor: alpha("#000", 0.28),
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)",
              "&:hover": { bgcolor: alpha("#000", 0.45) },
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Container maxWidth="lg">

        {/* ── Profile header ── */}
        <Box sx={{ pb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>

          {/* Avatar row */}
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }} justifyContent="space-between" gap={2}>

            <Stack direction="row" alignItems="flex-end" gap={2}>
              <Avatar
                src={profile.profilePictureUrl ?? undefined}
                sx={{
                  width: { xs: 80, md: 110 },
                  height: { xs: 80, md: 110 },
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
                  mt: { xs: -5, md: -7 },
                  fontSize: { xs: 32, md: 44 },
                  flexShrink: 0,
                }}
              >
                {profile.displayName[0]}
              </Avatar>

              <Box pb={0.5}>
                <Typography variant="h4" fontWeight={800} lineHeight={1.15}>
                  {profile.displayName}
                </Typography>
                <Typography color="text.secondary" variant="body2" mt={0.3}>
                  @{profile.username} · Joined {memberSince}
                </Typography>
              </Box>
            </Stack>

            {/* Stats */}
            <Stack direction="row" spacing={4} pb={0.5} flexShrink={0}>
              <Stat value={0} label="Artworks" />
              <Stat value={0} label="Adoptables" />
              <Stat value={0} label="Followers" onClick={() => setActiveTab("Followers")} />
              <Stat value={0} label="Following" onClick={() => setActiveTab("Following")} />
            </Stack>
          </Stack>

          {/* Social + Payment + Follow button */}
          <Stack direction="row" alignItems="center" gap={1} mt={2} flexWrap="wrap">

            {/* Social media */}
            {profile.socialMedias.map((sm, i) => (
              <Tooltip key={i} title={sm.name} placement="top" arrow>
                <IconButton
                  component="a"
                  href={sm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.05),
                    "&:hover": { bgcolor: isDark ? alpha("#fff", 0.12) : alpha("#000", 0.1) },
                  }}
                >
                  <SocialIcon sm={sm} />
                </IconButton>
              </Tooltip>
            ))}

            {profile.socialMedias.length > 0 && profile.paymentMethods.length > 0 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
            )}

            {/* Payment methods */}
            {profile.paymentMethods.map((pm, i) => (
              <Tooltip key={i} title={`${pm.name}: ${pm.accountValue}`} placement="top" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: isDark ? alpha("#fff", 0.04) : alpha("#000", 0.03),
                    cursor: "default",
                    height: 34,
                  }}
                >
                  <Box
                    component="img"
                    src={pm.iconUrl}
                    alt={pm.name}
                    sx={{ height: 18, width: "auto", objectFit: "contain", display: "block" }}
                  />
                </Box>
              </Tooltip>
            ))}

            {/* Follow button (non-own profiles) */}
            {!isOwnProfile && (
              <Button
                variant="contained"
                size="small"
                startIcon={<IconUserPlus size={15} />}
                sx={{ ml: "auto", textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                Follow
              </Button>
            )}
          </Stack>
        </Box>

        {/* ── Tabs ── */}
        <Tabs
          value={activeTab}
          onChange={(_, v: TabKey) => setActiveTab(v)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          {TABS.map((t) => (
            <Tab
              key={t}
              value={t}
              label={t}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minWidth: 90 }}
            />
          ))}
        </Tabs>

        {/* ── Tab content ── */}
        <Box sx={{ mt: 4 }}>

          {activeTab === "Gallery" && (
            <EmptyState
              icon={<IconPhoto size={56} stroke={1.2} />}
              title="No artworks yet"
              subtitle="Gallery coming soon"
            />
          )}

          {activeTab === "Adoptable" && (
            <AdoptableTab username={username} />
          )}

          {activeTab === "Commission" && (
            <EmptyState
              icon={<IconBrush size={56} stroke={1.2} />}
              title="No commissions available"
            />
          )}

          {(activeTab === "Followers" || activeTab === "Following") && (
            <Grid container spacing={2}>
              {MOCK_USERS.map((u) => (
                <Grid key={u.username} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    onClick={() => router.push(`/profile/${u.username}`)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                    }}
                  >
                    <Avatar sx={{ width: 44, height: 44 }}>{u.displayName[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={600} variant="body2">{u.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          )}

        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePageContent;
